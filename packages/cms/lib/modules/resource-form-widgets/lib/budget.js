const eventEmitter  = require('../../../../events').emitter;
const fetch = require('node-fetch');

module.exports = async function(self, options) {

    self.route('put', 'budget', async function(req, res) {
        eventEmitter.emit('resourceCrud');
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
        const siteId = req.data.global.siteId;
        
        const data = req.body;
        const getUrl = `${apiUrl}/api/site/${siteId}/idea/${data.id}`;
        const postUrl = `${apiUrl}/api/site/${siteId}/idea/${data.id}`;
        
        /**
         * Format header
         */
        const httpHeaders = {
            'Accept': 'application/json',            
            'Content-Type': 'application/json',
        };
    
        if (req.session.jwt) {
          httpHeaders['X-Authorization'] = `Bearer ${req.session.jwt}`;
        }
      
        const response = await fetch(getUrl, {
            headers: httpHeaders
        });

        if(response.ok) {
            const idea = await response.json();
            let ideaBudgets = [];

            try {
                ideaBudgets = JSON.parse(idea?.extraData?.budgetDocuments);
            }
            catch(e) {

            }

            const indexToDelete = ideaBudgets.findIndex(d =>{
                return d.name === data.name});
          
            if(indexToDelete > -1) {
                ideaBudgets.splice(indexToDelete, 1);
            }

            console.log(JSON.stringify({
                extraData: {
                    budgetDocuments: JSON.stringify(ideaBudgets)                
                },
            }));
            
            const putResponse = await fetch(postUrl, {
                method: 'PUT',
                headers: httpHeaders,
                body: JSON.stringify({
                    extraData: {
                        budgetDocuments: JSON.stringify(ideaBudgets)
                    },
                }),
            });

            if(putResponse.ok) {
                const ideaResponse = await putResponse.json();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  id: ideaResponse.id
                }));
            }           
        }
      });
}