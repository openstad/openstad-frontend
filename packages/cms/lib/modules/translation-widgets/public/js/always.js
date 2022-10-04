apos.define('translation-widgets', {
    extend: 'openstad-widgets',
    construct: function(self, options) {
      self.play = function($widget, data, options) {
        $widget.on('click', () => {
            // fetch content of nodes
            // send content to api
            // replace content with translated data

            let node = document.body;
            let toBeTranslated = [];
            toBeTranslated = handleNode( node, toBeTranslated );
            
            let contents = [];
            toBeTranslated.forEach(itemToTranslate => contents.push(itemToTranslate.orgText));

            let data = JSON.stringify({ contents, sourceLanguageCode: 'nl', targetLanguageCode: 'en-GB' });
            
            $.ajax({
                url: '/modules/translation-widgets/submit',
                method: 'POST',
                contentType: "application/json",
                data,
                success: function(data) {
                    console.log('success', data)
                }
            })
        })
      };

    handleNode = function(node, toBeTranslated) {
        const childNodes = node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
          if (childNodes[i].nodeType == 1) {
            let nodeName = childNodes[i].nodeName.toLowerCase();
            if (nodeName != 'script' && nodeName != 'style')handleNode(childNodes[i], toBeTranslated);
          } else if (childNodes[i].nodeType == 3) {
            let textContent = childNodes[i].textContent;
            textContent = textContent.replace(/^[\s\r\n]+/, '').replace(/[\s\r\n]+$/, '');
            if ( textContent ) {
              toBeTranslated.push({
                node: childNodes[i],
                orgText: textContent,
              })
            }
          }
        }
        return toBeTranslated;
      }
    },
  });