const rp = require('request-promise');
const eventEmitter  = require('../../../events').emitter;
const voteOverview = require('./lib/vote-overview');

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

const ideaStates = require('../../../config/idea.js').states;
const extraFields =  require('../../../config/extraFields.js').fields;
var merge = require('lodash.merge');
const fields = [
  {
      name: 'showShareButtons',
      type: 'boolean',
      label: 'Display share buttons?',
      choices: [
          {
              value: true,
              label: "Yes",
              showFields: ['shareChannelsSelection']
          },
          {
              value: false,
              label: "No"
          },
      ],
      def: true
  },
  {
    name: 'shareChannelsSelection',
    type: 'checkboxes',
    label: 'Select which share buttons you want to display (if left empty all social buttons will be shown)',
    choices: [
        {
            value: 'facebook',
            label: "Facebook"
        },
        {
            value: 'twitter',
            label: "Twitter"
        },
        {
            value: 'mail',
            label: "E-mail"
        },
        {
            value: 'whatsapp',
            label: "Whatsapp"
        },
    ]
  }
].concat(
    ideaStates.map((state) => {
      return {
        type: 'string',
        name: 'label' +  state.value,
        label: 'Label for photo: ' + state.value,
      }
    })
  )
  .concat(
    ideaStates.map((state) => {
      return {
        type: 'string',
        name: 'labelTime' +  state.value,
        label: 'Labelfor time status: : ' + state.value,
      }
    }));

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Idea single',
  addFields: fields,
  construct: function(self, options) {
     let classIdeaId;

     require('./lib/routes.js')(self, options);

     const postVote = (req, res, next) => {
      eventEmitter.emit('vote');

       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const siteId = req.data.global.siteId;
       const postUrl = `${apiUrl}/api/site/${siteId}/vote`;
       const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

       let votes = req.body.votes ? req.body.votes : [{
         ideaId: req.body.ideaId,
         opinion: req.body.opinion,
      //   ipOriginXXX: ip // 1111
       }];

       votes = votes.map((vote) => {
         vote.ipOriginXXX = ip;
         return vote;
       })

       const options = {
           method: 'POST',
           uri: postUrl,
           headers: {
               'Accept': 'application/json',
               "X-Authorization" : `Bearer ${req.session.jwt}`,
           },
           body: votes,
           json: true // Automatically parses the JSON string in the response
       };

       rp(options)
        .then(function (response) {
          if (req.redirectUrl) {
            res.redirect(req.redirectUrl);
          } else {
            res.end(JSON.stringify({
              id: response.id
            }));
          }
        })
        .catch(function (err) {
            console.log('===> voting err', err);
            res.status(500).json(err);
         });
     }

     const superPushAssets = self.pushAssets;
     self.pushAssets = function () {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('stylesheet', 'secondary', { when: 'always' });
       self.pushAsset('script', 'main', { when: 'always' });
     };

    const superLoad = self.load;
		self.load = function(req, widgets, next) {
			widgets.forEach((widget) => {
				widget.siteConfig = {
          minimumYesVotes: ( req.data.global.siteConfig && req.data.global.siteConfig.ideas && req.data.global.siteConfig.ideas.minimumYesVotes ),
          voteValues: ( req.data.global.siteConfig && req.data.global.siteConfig.votes && req.data.global.siteConfig.votes.voteValues ) || [{label: 'voor',value: 'yes'},{label: 'tegen',value: 'no'}],
        }
        if (widget.siteConfig.minimumYesVotes == null || typeof widget.siteConfig.minimumYesVotes == 'undefined') widget.siteConfig.minimumYesVotes = 100;
			});
			return superLoad(req, widgets, next);
		}

     const superOutput = self.output;
     self.output = function(widget, options) {
       widget.extraFields = extraFields;
       return superOutput(widget, options);
     };

     self.apos.app.get('/like', (req, res, next) => {
       if (
         req.data.global.siteConfig && req.data.global.siteConfig.votes
         && req.data.global.siteConfig.votes.voteType !== 'likes'
       ) {
         throw Error('GET Route only allowed for vote type like');
       }

       req.body.votes = [{
         ideaId: req.query.ideaId,
         opinion: req.query.opinion,
       }];

       req.redirectUrl = '/' + req.data.global.ideaSlug + '/' + req.query.ideaId;

       postVote(req, res, next);
     });

     self.apos.app.post('/vote', (req, res, next) => {
       postVote(req, res, next);
     });

     const superPageBeforeSend = self.pageBeforeSend;
     self.pageBeforeSend = (req, callback) => {
       const pageData = req.data.page;

       if (req.query.voteOpinion) {
         req.data.formToSubmit = {
           'opinion': req.query.voteOpinion
         }
       }

       callback();
       return superPageBeforeSend(req, callback);
     };
  }
};
