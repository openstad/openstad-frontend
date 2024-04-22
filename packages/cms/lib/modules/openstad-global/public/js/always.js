var translatedFirstTimeLoadingGlobal = true;
var translationNodesGlobal = [];
var traslationNlContentsGlobal = [];

apos.on('ready', function () {
  $('#translation-widget-select-global').on('change', function (e) {
    if (translatedFirstTimeLoadingGlobal) {
      translationNodesGlobal = handleNode(translationNodesGlobal);
      traslationNlContentsGlobal = getNlContentsFromNodes(
        translationNodesGlobal
      );
      translatedFirstTimeLoadingGlobal = false;
    }
    changeLanguage(e, translationNodesGlobal, traslationNlContentsGlobal);
  });

  var select = document.querySelector('#translation-widget-select-global');
  var isNormalUser = !hasModeratorRights; // references global var specified in layout.js
  if (isNormalUser && select) {
    setSelectedLanguage(localStorage.getItem('targetLanguageCode'));
  } else if (select) {
    select.setAttribute('disabled', true);
  }
});

function changeLanguage(e, nodes, nlContents) {
  var select = e.target;
  var targetLanguageCode = select.value;
  setSelectDisabled(select);

  if (targetLanguageCode === 'nl') {
    console.log(
      'Language is set to the default: ' +
        targetLanguageCode +
        '. No need to translate'
    );
    changeTextInNodes(nlContents, nodes);
    setSelectEnabled(select);
    saveLanguagePreference(targetLanguageCode);
    syncOtherTranslationWidgets(targetLanguageCode);
  } else {
    console.log('translating to', targetLanguageCode);

    var toastContainer = document.querySelector('#openstad-toast');
    addToast(toastContainer, 'info', 'De pagina wordt vertaald...', 5000);

    $.ajax({
      url: '/modules/translation-widgets/submit',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        contents: nlContents,
        sourceLanguageCode: 'nl',
        targetLanguageCode: targetLanguageCode,
        origin: window.location.href,
      }),
      success: function (sentences) {
        saveLanguagePreference(targetLanguageCode);
        sentences = sentences.map(function (sentence) {
          return sentence.text;
        });
        changeTextInNodes(sentences, nodes);
        setSelectEnabled(select);
        addToast(toastContainer, 'success', 'De pagina is succesvol vertaald');
        syncOtherTranslationWidgets(targetLanguageCode);
      },
      error: function () {
        setSelectEnabled(select);
        // setSelectedLanguage('nl');
        addToast(toastContainer, 'error', 'De pagina kon niet worden vertaald');
      },
    });
  }
}

function getNlContentsFromNodes(nodes) {
  return nodes.map(function (itemToTranslate) {
    return itemToTranslate.orgText;
  });
}

function getSelectContainer() {
  return $('.language-select-container');
}

function setSelectDisabled(select) {
  var languageSelectContainer = getSelectContainer();
  select.setAttribute('disabled', true);

  if (languageSelectContainer) {
    languageSelectContainer.addClass('languageLoading');
  }
}

function setSelectEnabled(select) {
  var languageSelectContainer = getSelectContainer();
  select.removeAttribute('disabled');

  if (languageSelectContainer) {
    languageSelectContainer.removeClass('languageLoading');
  }
}

function changeTextInNodes(sentences, nodes) {
  sentences.forEach(function (sentence, index) {
    nodes[index].node.textContent = sentence;
  });
}

function handleNode(toBeTranslated, node) {
  if (!node) {
    node = document.body;
  }

  var childNodes = node.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeType == Node.ELEMENT_NODE) {
      var nodeName = childNodes[i].nodeName.toLowerCase();
      if (nodeName != 'script' && nodeName != 'style') {
        handleNode(toBeTranslated, childNodes[i]);
      }
    } else if (childNodes[i].nodeType == Node.TEXT_NODE) {
      var parentElement = childNodes[i].parentElement;
      var shouldTranslate =
        parentElement && parentElement.getAttribute('translate') !== 'no';

      if (shouldTranslate) {
        var textContent = childNodes[i].textContent;

        if (textContent) {
          toBeTranslated.push({
            node: childNodes[i],
            orgText: textContent,
          });
        }
      }
    }
  }
  return toBeTranslated;
}

function addToast(container, typeOfInfoErrorOrSuccess, text, timeout, onClick) {
  if (container) {
    var wrapperElement = document.createElement('div');
    var messageElement = document.createElement('p');

    if (typeOfInfoErrorOrSuccess === 'success') {
      wrapperElement.setAttribute('class', 'toast-wrapper toast-success');
    } else if (typeOfInfoErrorOrSuccess === 'info') {
      wrapperElement.setAttribute('class', 'toast-wrapper toast-info');
    } else if (typeOfInfoErrorOrSuccess === 'error') {
      wrapperElement.setAttribute('class', 'toast-wrapper toast-error');
    }
    messageElement.appendChild(document.createTextNode(text));
    wrapperElement.appendChild(messageElement);

    if (!timeout || timeout === 0) {
      var removeButton = document.createElement('button');
      var removeIcon = document.createElement('span');
      removeIcon.setAttribute('class', ' fa fa-times-circle');
      removeButton.appendChild(removeIcon);

      removeButton.onclick = function () {
        container.removeChild(wrapperElement);
        onClick && onClick();
      };
      wrapperElement.appendChild(removeButton);
    }

    container.appendChild(wrapperElement);

    if (Number.isInteger(timeout) && timeout > 0) {
      setTimeout(function () {
        container.removeChild(wrapperElement);
      }, timeout);
    }
  }
}

// If there is a global select, let it handle managing the state of all translation-selects. If not the translation widget has already done its work, just update the other translation widgets
function setSelectedLanguage(language) {
  var globalLangSelect = $('#translation-widget-select-global');
  if (globalLangSelect.length) {
    $('#translation-widget-select-global')
      .val(language ? language : 'nl')
      .trigger('change');
  } else {
    syncOtherTranslationWidgets(language);
    var lastSelect = $('#translation-widget-select:last');
    if (lastSelect.length) {
      lastSelect.val(language ? language : 'nl').trigger('change');
    }
  }
}

function syncGlobalTranslationWidgets(language) {
  document
    .querySelectorAll('#translation-widget-select-global')
    .forEach(function (select) {
      select.value = language ? language : 'nl';
    });
}

function syncOtherTranslationWidgets(language) {
  document
    .querySelectorAll('#translation-widget-select')
    .forEach(function (select) {
      select.value = language ? language : 'nl';
    });
}

function saveLanguagePreference(targetLanguageCode) {
  try {
    localStorage.setItem('targetLanguageCode', targetLanguageCode);
  } catch (quotaExceededError) {
    console.log('Could not save the language preference');
  }
}
