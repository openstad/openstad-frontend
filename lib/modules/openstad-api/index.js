module.exports = {
    alias: 'openstad',
    construct(self, options) {

        require('./lib/api.js')(self, options);

        /**
         *  Invoked just after Apostrophe either inserts or updates a document.
         *  Always check doc.type first, and return right away if it is not relevant to your code.
         *  The arguments are the same arguments that were passed to apos.docs.insert or apos.docs.update
         */
        self.on('apostrophe-docs:afterSave', 'syncApi', async (req, doc, options) => {

            if(doc.type !== 'apostrophe-global') {
                return;
            }
            // Avoid syncing api when it's a default-draft save from workflow
            if(doc.workflowLocale && doc.workflowLocale === 'default-draft') {
                return;
            }

            try {
                await self.updateSite(req, req.data.global.siteId, {
                    title: doc.siteTitle,
                });
            } catch(err) {
                console.error(err);
            }
        });

        self.on('apostrophe:afterInit', 'getIdeas', async () => {
            console.log('after init');
        });
    }
};
