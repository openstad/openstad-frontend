/** 
 * Widget responsible for the translation of the page
 * 
*/
apos.define('translation-widgets', {
    extend: 'openstad-widgets',
    construct: function (self, options) {
        $('#translation-widget-select')
            .on('change', function (e) { return changeLanguage(e) });
    }
});


/**
 * Makes a call to the backend to translate. This needs to happen to set the initial selection after rendering the page, 
 * collecting the initial values and if the language is not the default 'nl', fetching the translations
 */
apos.on('ready', function() {
    var select = document.querySelector('#translation-widget-select');
    var presentGlobalSelect = document.querySelector('#translation-widget-select-global');


    var isNormalUser = !hasModeratorRights; // references global var specified in layout.js
    if(isNormalUser && !presentGlobalSelect) {
        setSelectedLanguage(localStorage.getItem('targetLanguageCode'));
    } else if(select) {
        select.setAttribute('disabled', true);
    }
});
