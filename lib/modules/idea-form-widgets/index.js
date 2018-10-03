var rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Idea form',
  addFields: [
    {
      name: 'siteId',
      type: 'string',
      label: 'Site ID',
      required: true
    }
  ],
/*  construct: function(self, options) {
    self.pageBeforeSend = function(req, callback) {

      var options = {
          uri: 'https://stemvanoost.amsterdam.nl/plannen',
          headers: {
              'Accept': 'application/json'
          },
          json: true // Automatically parses the JSON string in the response
      };

      rp(options)
      .then(function (ideas) {
          console.log('Count idea ');
      //    console.log(ideas);
          req.data.ideas = ideas.runningIdeas;
          return callback(null);
      })
      .catch(function (err) {
          console.log('Errrorororo', err);
          return callback(err);
      });

    }
  } */
};
