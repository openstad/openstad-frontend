apos.on('ready', function () {
    var nodes = [];
    var selectedLanguage = sessionStorage.getItem("targetLanguageCode");

    /** 
     * The translate widget if set on the page will trigger an onchange event when it has been loaded
     * thus triggering the fetching of translations. Then this one should do nothing and let the dedicated 
     * widget make the call.
     */    
    var translationWidgetOnSamePage = $('.translation-widget-select').length > 0;

    if (!translationWidgetOnSamePage && selectedLanguage && selectedLanguage !== 'nl') {
        nodes = handleNode(document.body, nodes);
        var nlContents = nodes.map(function (itemToTranslate) { return itemToTranslate.orgText });
        $.ajax({
            url: '/modules/openstad-global/translate',
            method: 'post',
            contentType: "application/json",
            data: JSON.stringify({
                contents: nlContents,
                sourceLanguageCode: 'nl',
                targetLanguageCode: selectedLanguage,
                origin: window.location.href
            }),
            success: function (sentences) {
                sentences = sentences.map(function (sentence) { return sentence.text });
                changeTextInNodes(sentences, nodes);
            },
        });
    }
});

changeTextInNodes = function (sentences, nodes) {
    sentences.forEach(function (sentence, index) {
        nodes[index].node.textContent = sentence;
    });
}

handleNode = function (node, toBeTranslated) {
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
