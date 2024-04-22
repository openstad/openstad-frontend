/**
 * Widget responsible for the translation of the page
 *
 * IMPORTANT, the translatedVariables used for the changeLanguage function are shared from openstad-global/public/js/always.js.
 */
apos.define('translation-widgets', {
  extend: 'openstad-widgets',
  construct: function (self, options) {
    $('#translation-widget-select').on('change', function (e) {
      if (translatedFirstTimeLoadingGlobal) {
        translationNodesGlobal = handleNode(translationNodesGlobal);
        traslationNlContentsGlobal = getNlContentsFromNodes(
          translationNodesGlobal
        );
        translatedFirstTimeLoadingGlobal = false;
      }

      var globalSelect = $('#translation-widget-select-global');
      
      if (!globalSelect.length) {
        changeLanguage(e, translationNodesGlobal, traslationNlContentsGlobal);
      } else {
        setSelectedLanguage(e.target.value);
      }
    });
  },
});

/**
 * Makes a call to the backend to translate. This needs to happen to set the initial selection after rendering the page,
 * collecting the initial values and if the language is not the default 'nl', fetching the translations
 */
apos.on('ready', function () {
  var select = document.querySelector('#translation-widget-select');

  var isNormalUser = !hasModeratorRights; // references global var specified in layout.js
  if (isNormalUser) {
    setSelectedLanguage(localStorage.getItem('targetLanguageCode'));
  } else if (select) {
    select.setAttribute('disabled', true);
  }
});
