const rp = require('request-promise');

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const getPosterImageUrl = (idea, googleMapsApiKey) => {
      return idea.imageUrl ? idea.imageUrl : idea.location && idea.location && idea.location.coordinates ? 'https://maps.googleapis.com/maps/api/streetview?'+
                           'size=800x600&'+
                           `location=${idea.location.coordinates[0]},${idea.location.coordinates[1]}&`+
                           'heading=151.78&pitch=-0.76&key=' + googleMapsApiKey
                         : null;

}
const enrichIdeas = (ideas, googleMapsApiKey) => {
  return ideas.map((idea) => {
    idea.posterImageUrl = getPosterImageUrl(idea, googleMapsApiKey)
    return idea;
  });
};

const ideas = require('./ideas.json');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Idea single',
  addFields: [
  //  {
  //    name: 'displayVote',
  //    type: 'string',
  //    label: 'Display vote',
    //  required: true
  //  }
  ],
/*  construct: function(self, options) {

  /*  self.route('get', 'idea/:ideaId', function(req, res, next) {
      req.data.ideaId = req.params.ideaId;
      next();
    });
*/
/*
    self.pageBeforeSend = function(req, callback) {
      console.log('---->  req.query.id', req.query.id);
      req.data.ideaId = req.query.id;
      return callback(null);
    }
  }*/
  construct: function(self, options) {
     let classIdeaId;

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('stylesheet', 'secondary', { when: 'always' });
       self.pushAsset('script', 'main', { when: 'always' });
     };

     const superPageBeforeSend = self.pageBeforeSend;
     self.pageBeforeSend = (req, callback) => {
       const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;
       classIdeaId = ideaId;
       console.log('setIDeaID', classIdeaId);
       if (ideaId) {
         // req.data.ideas = enrichIdeas(ideas, googleMapsApiKey);
          req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(ideaId, 10)) : null;
          req.data.ideaId = ideaId;
       }

       callback();
       return superPageBeforeSend(req, callback);
     };

     self.apos.app.post('/vote', (req, res, next) => {
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const siteId = req.data.global.siteId;
       const postUrl = `${apiUrl}/api/site/${siteId}/idea/${req.body.ideaId}/vote`;
       const options = {
           method: 'POST',
           uri: postUrl,
           headers: {
               'Accept': 'application/json',
               "X-Authorization" : `Bearer ${req.session.jwt}`,
           },
           body: {
             opinion: req.body.opinion,
           },
           json: true // Automatically parses the JSON string in the response
       };


       rp(options)
       .then(function (response) {
          res.redirect(req.header('Referer') || '/');
       })
       .catch(function (err) {
          console.log('err err err ', err)
          res.redirect(req.header('Referer') || '/');
       });
     });


 /*

     const superLoad = self.load;
     self.load = (req, widgets, callback) => {
       const appUrl = self.apos.settings.getOption(req, 'appUrl');
       const ideaSlug = req.data.global.ideaSlug;

       widgets.forEach((widget) => {
          widget.appUrl = appUrl;//
          widget.ideaSlug = ideaSlug;
          widget.formattedContainerStyles = widget.containerStyles ? styleSchema.format(widget.containerStyles) : '';
       });

       return superLoad(req, widgets, callback);
     }

     const superOutput = self.output;
     self.output = function(widget, options) {
       widget.pageUrl = `${widget.appUrl}/${widget.ideaSlug}/${classIdeaId}`;
       var result = superOutput(widget, options);
       return result;
     };

    const superPageBeforeSend = self.pageBeforeSend;

     self.pageBeforeSend = function(req, callback) {
       const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;

       console.log('idea-req.query.ideaId', req.query.ideaId);

       if (ideaId) {
         // req.data.ideas = enrichIdeas(ideas, googleMapsApiKey);
          req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(ideaId, 10)) : null;
          req.data.ideaId = ideaId;
       }

       console.log('req.data.widgets', req.data.widgets);*/
      // callback();
      // return superPageBeforeSend(req, callback);
    //};

  }




};
