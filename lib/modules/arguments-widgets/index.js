const rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Arguments',
  addFields: [
    {
      name: 'ideaId',
      type: 'string',
      label: 'Idea ID (if empty it will try to fetch the ideaId from the URL)',
    },
    {
      name: 'emptyPlaceholder',
      type: 'string',
      label: 'Text for no results',
      required: true
    },
    {
      name: 'argumentSentiment',
      type: 'select',
      choices: [
        {
          label: 'Geen',
          value: '',
        },
        {
          label: 'Voor',
          value: 'for',
        },
        {
          label: 'Tegen',
          value: 'against',
        },
      ]
    },
  ],
  construct: function(self, options) {
     const superPushAssets = self.pushAssets;
     //const auth = "Basic " + new Buffer("xxx:xxx#").toString("base64");

     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('script', 'main', { when: 'always' });
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };

//const superPageBeforeSend = self.pageBeforeSend;

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

       //
     }*/

//     const superLoad = self.load;
    /*      self.load = (req, widgets, callback) => {
       const widgetsWithData = [];
       let actions = [];

  widgets.forEach((widget) => {
         actions.push(new Promise((resolve, reject) => {
           const currentWidget = widget;
           const apiUrl = self.apos.settings.getOption(req, 'apiUrl');

           /**
             * will be fetched from the active idea based upon the URL
             *
           if (!widget.ideaId) {
             resolve();
           }

            var options = {
                uri: `${apiUrl}/api/site/${req.data.global.siteId}/idea/${widget.ideaId}/argument`,
                headers: {
                    'Accept': 'application/json',
                },
                json: true // Automatically parses the JSON string in the response
            };

            rp(options)
              .then(function (arguments) {
                currentWidget.arguments = arguments;
                widgetsWithData.push(currentWidget);
                 resolve();
              })
              .catch((e) => {
                console.log('err with loading widget.ideaId', widget.ideaId);

                widgetsWithData.push(currentWidget);
                resolve();
              })

         }));
       });

       if (!actions) {
         return superLoad(req, widgets, callback);
       } else {
       return Promise
         .all(actions)
         .then(() => {
           return superLoad(req, widgetsWithData, callback);
         })
         .catch((e) => {
        //   callback();
           return superLoad(req, widgets, callback);
         });
       }

     }*/

     var superOutput = self.output;
     self.output = function(widget, options) {
       return superOutput(widget, options);
  //     return result;
     };

  }

  /*  construct: function(self, options) {

    } */
};
