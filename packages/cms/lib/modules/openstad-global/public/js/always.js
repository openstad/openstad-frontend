apos.on('ready', function() {
    var nodes = [];
    const selectedLanguage = sessionStorage.getItem("targetLanguageCode");

    if(selectedLanguage && selectedLanguage !== 'nl') {
        nodes = handleNode(document.body, nodes);
      const nlContents = nodes.map(function(itemToTranslate) { return itemToTranslate.orgText });

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
                sentences = sentences.map(function(sentence) { returnsentence.text });
                changeTextInNodes(sentences, nodes);
            }, 
        });
    }
});

changeTextInNodes = function (sentences, nodes) {
    sentences.forEach(function(sentence, index) {
        nodes[index].node.textContent = sentence;
    });
}

handleNode = function (node, toBeTranslated) {
    const childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == Node.ELEMENT_NODE) {
            var nodeName = childNodes[i].nodeName.toLowerCase();
            if (nodeName != 'script' && nodeName != 'style') {
                handleNode(childNodes[i], toBeTranslated);
            }
        } else if (childNodes[i].nodeType == Node.TEXT_NODE) {
            const parentElement = childNodes[i].parentElement;
            const shouldTranslate = parentElement && parentElement.getAttribute('translate') !== 'no';

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
