const rp = require('request-promise');

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

     self.load = function(req, widgets, callback) {
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const siteId = 1;

       var options = {
           uri: `${apiUrl}/api/site/${siteId}/submission`,
           headers: {
               'Accept': 'application/json',
    //           "Authorization" : auth
           },
           json: true // Automatically parses the JSON string in the response
       };

       rp(options)
       .then(function (submissions) {
          req.data.submissions = submissions;
          // return callback(null);
      //    callback();
          return superLoad(req, widgets, callback);

       })
       .catch(function (err) {
    //       console.log('Errrorororo', err);
    //      callback();
          return superLoad(req, widgets, callback);
       });

     }


  }

  /*  construct: function(self, options) {

    } */
};
