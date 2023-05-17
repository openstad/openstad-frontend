/**
 * GENERIC form submisson widget, developed in Den Haag,
 * Currently not active, not properly tested!!!
 */
const fetch = require('node-fetch');

module.exports = {
  extend: 'openstad-widgets',
  label: 'Inzendingen',
  addFields: [
    {
      name: 'siteId',
      type: 'string',
      label: 'Site ID',
      required: true
    },
    {
      name: 'displayType',
      label: 'Type ',
      type: 'select',
      choices: [
        {
          label: 'Kaart',
          value: 'map',
        },
        {
          label: 'Grid',
          value: 'grid',
        }
      ]
    },
  ],
  construct: function(self, options) {
     const superPushAssets = self.pushAssets;

     self.pushAssets = function() {
       superPushAssets();
    //   self.pushAsset('stylesheet', 'gridder-vendor', { when: 'always' });
  //     self.pushAsset('stylesheet', 'gridder-implementation', { when: 'always' });
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };

    // const superPageBeforeSend = self.pageBeforeSend;

    const superLoad = self.load;

     self.load = async function(req, widgets, callback) {
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const siteId = 1;

       try {
         let response = await fetch(`${apiUrl}/api/site/${siteId}/submission`, {
           headers: {
             'Accept': 'application/json',
           },
           method: 'GET',
         })
         if (!response.ok) {
           console.log(response);
           throw new Error('Fetch failed')
         }
         let submissions = await response.json();
         req.data.submissions = submissions;
         return superLoad(req, widgets, callback);

       } catch(err) {
         console.log(err);
         return superLoad(req, widgets, callback);
       };

     }

  }

  /*  construct: function(self, options) {

    } */
};
