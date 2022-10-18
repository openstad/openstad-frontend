/** 
 * Widget responsible for the translation of the page
 * 
*/

apos.define('translation-widgets', {
    extend: 'openstad-widgets',
    construct: function (self, options) {
        let firstTimeLoading = true;
        let nodes = [];
        let nlContents = [];
        
        const languageSelectContainer = $('.language-select-container');

        $('.translation-widget-select')
            .on('change', (e) => changeLanguage(e));

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
                sessionStorage.setItem("targetLanguageCode", targetLanguageCode);
                console.log("Saved language preference");
            } catch(quotaExceededError) {
                console.log("Could not save the language preference");
            }
        }

        changeLanguage = function (e) {
            const select = e.target;
            const targetLanguageCode = select.value;
            setSelectDisabled(select);

            console.log(`translate to ${targetLanguageCode}`);
            
            let node = document.body;

            if (firstTimeLoading) {
                nodes = handleNode(node, nodes);
                nlContents = nodes.map(itemToTranslate => itemToTranslate.orgText);
                firstTimeLoading = false;
            }

            if (targetLanguageCode === 'nl') {
                changeTextInNodes(nlContents, nodes);
                setSelectEnabled(select);
                saveLanguagePreference(targetLanguageCode);
            } else {
                $.ajax({
                    url: '/modules/translation-widgets/submit',
                    method: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify({
                        contents: nlContents,
                        sourceLanguageCode: 'nl',
                        targetLanguageCode,
                        origin: window.location.href
                    }),
                    success: function (sentences) {
                        saveLanguagePreference(targetLanguageCode);
                        sentences = sentences.map(sentence => sentence.text);
                        changeTextInNodes(sentences, nodes);
                        setSelectEnabled(select);
                    }, 
                    error: function() {
                        setSelectEnabled(select);
                    }
                })
            }
        };
    }
});

apos.on('ready', function() {
    const selectedLanguage = sessionStorage.getItem('targetLanguageCode');
    $('.translation-widget-select').val(selectedLanguage ? selectedLanguage : 'nl').trigger('change');
});