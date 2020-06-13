
module.exports = (self, options) => {
    const widgetName = self.__meta.name.replace('-widgets', '');
    const openstadApiSync = options.openstadApiConfigSync;
    const widgetFields = options.addFields;

    // Todo: validate fields with api config fields?
    const apiSyncFields = self.apos.openstadApi.getApiSyncFields(widgetFields);

    self.on('apostrophe-docs:afterSave', 'syncApi');

    self.syncApi = async (req, doc, options) => {

        // Todo: check allowed doc types (for now only default is allowed)
        if (openstadApiSync === false || (doc.workflowLocale && doc.workflowLocale === 'default-draft') || apiSyncFields.length < 1 || doc.type !== 'default') {
            return;
        }

        if(!doc.body || !doc.body.items || doc.body.items.length < 1) {
          return;
        }

        doc.body.items.forEach((item) => {
            const items = [].concat(...item.area1.items, ...item.area2.items, ...item.area3.items, ...item.area4.items);

            items.forEach(async (item) => {
                if(item.type === widgetName) {
                    try {
                        await self.apos.openstadApi.updateSiteConfig(req, req.data.global.siteConfig, item, apiSyncFields);
                    } catch(error) {
                        // Todo: log error and do something more?
                        console.error(error);
                    }
                }
            });
        });
    };

    // Override widget field values if apiSyncField is set.
    const superLoad = self.load;
    self.load = async function(req, widgets, next) {
        if (openstadApiSync === false) {
            return superLoad(req, widgets, next);
        }

        widgets.map(async (widget) => {
            return self.apos.openstadApi.syncApiFields(widget, apiSyncFields, req.data.global.siteConfig, req.data.global.workflowLocale, req.body);
        });

        return superLoad(req, widgets, next);
    }
};
