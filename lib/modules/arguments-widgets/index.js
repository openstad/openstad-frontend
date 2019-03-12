const rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Arguments',
  addFields: [
    {
      name: 'siteId',
      type: 'string',
      label: 'Site ID',
      required: true
    }
  ],
  construct: function(self, options) {
     const superPushAssets = self.pushAssets;
     //const auth = "Basic " + new Buffer("xxx:xxx#").toString("base64");

     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };

     const superPageBeforeSend = self.pageBeforeSend;

    /* self.pageBeforeSend = function(req, callback) {
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');

       var options = {
           uri: apiUrl + '/api/site/1/argument',
           headers: {
               'Accept': 'application/json',
      //         "Authorization" : auth
           },
           json: true // Automatically parses the JSON string in the response
       };

       rp(options)
         .then(function (arguments) {
             req.data.arguments = arguments;
            // return callback(null);
            callback();
            return superPageBeforeSend(req, callback);

         })
         .catch(function (err) {
            callback();
            return superPageBeforeSend(req, callback);
         });

     }*/


    /* self.load = (req, widgets, callback) => {
       console.log('widgets', widgets)

       setTimeout(() => {
         widgets = widgets.map((widget) => {
           widget.siteId = 'overwrite';

           return widget;
         });

         return superLoad(req, widgets, callback);

       }, 2000);

       console.log('asasas');

       //
     }*/

     const superLoad = self.load;
     self.load = (req, widgets, callback) => {
       const widgetsWithData = [];
       let actions = [];

       widgets.forEach((widget) => {
         actions.push(new Promise((resolve, reject) => {
           const currentWidget = widget;

           const apiUrl = self.apos.settings.getOption(req, 'apiUrl');

            var options = {
                uri: `${apiUrl}/api/site/${currentWidget.siteId}/argument`,
                headers: {
                    'Accept': 'application/json',
            //         "Authorization" : auth
                },
                json: true // Automatically parses the JSON string in the response
            };

            rp(options)
              .then(function (arguments) {
                currentWidget.arguments = arguments;
                widgetsWithData.push(currentWidget);
                 // return callback(null);
                 resolve();
              })
              .catch((e) => {
                console.log('err with loading arguments', e);
                widgetsWithData.push(currentWidget);
                resolve();
              })

         }));
       });

       return Promise
         .all(actions)
         .then(() => {
           return superLoad(req, widgetsWithData, callback);
         })
         .catch((e) => {
           console.log('err with loading promises arguments', e);
        //   callback();
           return superLoad(req, widgetsWithData, callback);
         });

     }

     var superOutput = self.output;
     self.output = function(widget, options) {
       console.log('=> widget', widget);
       return superOutput(widget, options);
       return result;
     };

  }

  /*  construct: function(self, options) {

    } */
};
