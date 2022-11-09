apos.on('ready', function () {
    var nodes = [];
    var selectedLanguage = sessionStorage.getItem("targetLanguageCode");

    /** 
     * The translate widget if set on the page will trigger an onchange event when it has been loaded
     * thus triggering the fetching of translations. Then this one should do nothing and let the dedicated 
     * widget make the call.
     */    
    var translationWidgetOnSamePage = $('.translation-widget-select').length > 0;

    var userHasSpecialRole = hasModeratorRights; // references global var specified in layout.js'; 
    var toastContainer = document.querySelector("#openstad-toast");

    if (!userHasSpecialRole && !translationWidgetOnSamePage && selectedLanguage && selectedLanguage !== 'nl') {
        addToast(toastContainer, "info", "De pagina wordt vertaald...", 3000);

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
                addToast(toastContainer, "success", "De pagina is succesvol vertaald");
            },
            error: function() {
                addToast(toastContainer, "error", "De pagina kon niet worden vertaald");
            }
        });
    } else if(userHasSpecialRole) {
        addToast(toastContainer, "info", "De vertaalwidget kan niet worden gebruikt tijdens het bewerken van de site.");
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


function addToast(container, typeOfInfoErrorOrSuccess, text, optionalTimeout) {
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
        
        if(!optionalTimeout) {
            var removeButton = document.createElement("button");
            var removeIcon = document.createElement("span");
            removeIcon.setAttribute("class", " fa fa-times-circle");
            removeButton.appendChild(removeIcon);
    
            removeButton.onclick = function() {
                container.removeChild(wrapperElement);
            };
            wrapperElement.appendChild(removeButton);
        }
     
        container.appendChild(wrapperElement);

        if(optionalTimeout) {
            setTimeout(function(){
                container.removeChild(wrapperElement);
            }, optionalTimeout);
        }
    }
}