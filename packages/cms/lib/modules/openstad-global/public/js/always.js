apos.on('ready', function () {
    var firstTimeLoading = true;
    var nodes = [];
    var nlContents = [];

    // var selectedLanguage = localStorage.getItem("targetLanguageCode");
    // var toastContainer = document.querySelector("#openstad-toast");


    var languageSelectContainer = $('.language-select-container');

    $('.translation-widget-select')
        .on('change', function (e) { return changeLanguage(e) });

    function setSelectDisabled(select) {
        select.setAttribute('disabled', true);
        languageSelectContainer.addClass('languageLoading');
    };

    function setSelectEnabled(select) {
        select.removeAttribute('disabled');
        languageSelectContainer.removeClass('languageLoading');
    };

    function saveLanguagePreference(targetLanguageCode) {
        try{
            localStorage.setItem("targetLanguageCode", targetLanguageCode);
        } catch(quotaExceededError) {
            console.log("Could not save the language preference");
        }
    }

    function changeLanguage (e) {
        var select = e.target;
        var targetLanguageCode = select.value;
        setSelectDisabled(select);

        
        var node = document.body;

        if (firstTimeLoading) {
            nodes = handleNode(node, nodes);
          nlContents = nodes.map(function(itemToTranslate) { return itemToTranslate.orgText });
            firstTimeLoading = false;
        }

        if (targetLanguageCode === 'nl') {
            console.log("Language is set to the default: " + targetLanguageCode +". No need to translate");
            changeTextInNodes(nlContents, nodes);
            setSelectEnabled(select);
            saveLanguagePreference(targetLanguageCode);
        } else {
            console.log('translating to', targetLanguageCode);

            var toastContainer = document.querySelector("#openstad-toast");
            addToast(toastContainer, "info", "De pagina wordt vertaald...", 5000);

            $.ajax({
                url: '/modules/translation-widgets/submit',
                method: 'POST',
                contentType: "application/json",
                data: JSON.stringify({
                    contents: nlContents,
                    sourceLanguageCode: 'nl',
                    targetLanguageCode: targetLanguageCode,
                    origin: window.location.href
                }),
                success: function (sentences) {
                    saveLanguagePreference(targetLanguageCode);
                    sentences = sentences.map(function(sentence) { return sentence.text });
                    changeTextInNodes(sentences, nodes);
                    setSelectEnabled(select);
                    addToast(toastContainer, "success", "De pagina is succesvol vertaald");
                }, 
                error: function() {
                    setSelectEnabled(select);
                    setSelectedLanguage('nl');
                    addToast(toastContainer, "error", "De pagina kon niet worden vertaald");
                }
            });
        }
    };


    function setSelectedLanguage(language) {
        $('.translation-widget-select').val(language ? language : 'nl').trigger('change');
    }




    // var selectedLanguage = localStorage.getItem("targetLanguageCode");
    // var toastContainer = document.querySelector("#openstad-toast");

    /** 
     * The translate widget if set on the page will trigger an onchange event when it has been loaded
     * thus triggering the fetching of translations. Then this one should do nothing and let the dedicated 
     * widget make the call.
     */    
    // var translationWidgetOnSamePage = $('.translation-widget-select').length > 0;

    // $('.translation-widget-select').on('change', function (e) { startTranslation(nodes, selectedLanguage, toastContainer)});


    // var userHasSpecialRole = hasModeratorRights; // references global var specified in layout.js'; 
    // var shouldTranslate = false; // references global var specified in layout.js'; 

    // if(shouldTranslate) {
    //     if (!userHasSpecialRole && !translationWidgetOnSamePage && selectedLanguage && selectedLanguage !== 'nl') {
    //         startTranslation(nodes, selectedLanguage);
    //     } else if(userHasSpecialRole) {
    //         if(!sessionStorage.getItem("cannot-translate-acknowledged")) {
    //             addToast(toastContainer, "info", "De vertaalwidget kan niet worden gebruikt tijdens het bewerken van de site.", 0, function() {
    //                 sessionStorage.setItem("cannot-translate-acknowledged", true);
    //             });
    //         }
    //     }
    // }
});


function changeTextInNodes (sentences, nodes) {
    sentences.forEach(function (sentence, index) {
        nodes[index].node.textContent = sentence;
    });
}

function handleNode (node, toBeTranslated) {
    var childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == Node.ELEMENT_NODE) {
            var nodeName = childNodes[i].nodeName.toLowerCase();
            if (nodeName != 'script' && nodeName != 'style') {
                handleNode(childNodes[i], toBeTranslated);
            }
        } else if (childNodes[i].nodeType == Node.TEXT_NODE) {
            var parentElement = childNodes[i].parentElement;
            var shouldTranslate = parentElement && parentElement.getAttribute('translate') !== 'no';

            if (shouldTranslate) {
                var textContent = childNodes[i].textContent;
              
                if (textContent) {
                    toBeTranslated.push({
                        node: childNodes[i],
                        orgText: textContent,
                    })
                }
            }
        }
    }
    return toBeTranslated;
}


function addToast(container, typeOfInfoErrorOrSuccess, text, timeout, onClick) {
    if(container) {
        var wrapperElement = document.createElement("div");
        var messageElement = document.createElement("p");
        
        if(typeOfInfoErrorOrSuccess === 'success') {
            wrapperElement.setAttribute("class", "toast-wrapper toast-success");
        } else if(typeOfInfoErrorOrSuccess === 'info') {
            wrapperElement.setAttribute("class", "toast-wrapper toast-info");
        } else if(typeOfInfoErrorOrSuccess === 'error') {
            wrapperElement.setAttribute("class", "toast-wrapper toast-error");
        }
        messageElement.appendChild(document.createTextNode(text));
        wrapperElement.appendChild(messageElement);
        
        if(!timeout || timeout === 0) {
            var removeButton = document.createElement("button");
            var removeIcon = document.createElement("span");
            removeIcon.setAttribute("class", " fa fa-times-circle");
            removeButton.appendChild(removeIcon);
    
            removeButton.onclick = function() {
                container.removeChild(wrapperElement);
                onClick && onClick();
            };
            wrapperElement.appendChild(removeButton);
        }
     
        container.appendChild(wrapperElement);

        if(Number.isInteger(timeout) && timeout > 0) {
            setTimeout(function(){
                container.removeChild(wrapperElement);
            }, timeout);
        }
    }
}