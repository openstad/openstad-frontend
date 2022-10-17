/** 
 * Widget responsible for the translation of the page
 * 
*/

apos.define('translation-widgets', {
    extend: 'openstad-widgets',
    construct: function (self, options) {
        let nodes = [];
        let nlContents = [];
        let firstTimeLoading = true;

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
                changeTextInNodes(nlContents);
                setSelectEnabled(select);
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
                        sentences = sentences.map(sentence => sentence.text);
                        changeTextInNodes(sentences);
                        setSelectEnabled(select);
                    }, 
                    error: function() {
                        setSelectEnabled(select);
                    }
                })
            }
        }

        changeTextInNodes = function (sentences, postFix = '') {
            sentences.forEach((sentence, index) => {
                nodes[index].node.textContent = `${sentence}${postFix}`;
            });
        }

        handleNode = function (node, toBeTranslated) {
            const childNodes = node.childNodes;
            for (let i = 0; i < childNodes.length; i++) {
                if (childNodes[i].nodeType == Node.ELEMENT_NODE) {
                    let nodeName = childNodes[i].nodeName.toLowerCase();
                    if (nodeName != 'script' && nodeName != 'style') {
                        handleNode(childNodes[i], toBeTranslated);
                    }
                } else if (childNodes[i].nodeType == Node.TEXT_NODE) {
                    const parentElement = childNodes[i].parentElement;
                    const shouldTranslate = parentElement && parentElement.getAttribute('translate') !== 'no';

                    if (shouldTranslate) {
                        let textContent = childNodes[i].textContent;
                        textContent = textContent.replace(/^[\s\r\n]+/, '').replace(/[\s\r\n]+$/, '');
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
    },
});