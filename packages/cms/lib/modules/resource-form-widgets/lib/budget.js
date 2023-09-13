const eventEmitter  = require('../../../../events').emitter;
const fetch = require('node-fetch');
const fs = require('fs');

module.exports = async function(self, options) {

    self.route('put', 'budget', async function(req, res) {
        res.setHeader('Content-Type', 'application/json');
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

            // d.name is a string while d.date gets returned as a string, using weak comparison
            const indexToDelete = ideaBudgets.findIndex(d =>{
                return d.name === data.name && d.date == data.date});
          
            if(indexToDelete > -1) {
                const removedBudget = ideaBudgets.splice(indexToDelete, 1)[0];
                const hashName = removedBudget.url.substring(removedBudget.url.lastIndexOf("/") + 1);
                
                const attachmentsPath =
                `public/uploads/attachments/resource-form-uploads/${
                data.id}/${hashName}`

                try {
                    if (fs.existsSync(attachmentsPath)) {
                        console.log("Removing the file")
                        fs.rmSync(attachmentsPath, { recursive: true });
                    }
                }
                catch(e) {
                    console.log("The file could not be deleted");
                }
            }
            
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
                res.end(JSON.stringify({
                  id: ideaResponse.id
                }));
            }           
        }
      });
}