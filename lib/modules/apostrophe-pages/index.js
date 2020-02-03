// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu
const rp              = require('request-promise');
const moment          = require('moment'); // returns the new locale, in this case 'de'
const url             = require('url');
const dateFormat      = require('./dateFormat');
const internalApiUrl  = process.env.INTERNAL_API_URL;
const cache           = require('../../../services/cache').cache;

module.exports = {
  types: [
    {
      name: 'default',
      label: 'Default'
    },
    {
      name: 'idea',
      label: 'Idea'
    },
    {
      name: 'home',
      label: 'Home'
    }

    // Add more page types here, but make sure you create a corresponding
    // template in lib/modules/apostrophe-pages/views/pages!
  ],

  construct: function (self, options) {
     self.apos.app.use((req, res, next) => {
      const globalData = req.data.global;
      const csrf = self.apos.settings.getOption(req, 'csrf');

      req.data.dateFormat = dateFormat;
       const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;
       const headers = {
         'Accept': 'application/json',
       };

       if (req.session.jwt) {
         headers["X-Authorization"] = `Bearer ${req.session.jwt}`;
       }

       const thisHost = req.headers['x-forwarded-host'] || req.get('host');
       const protocol = req.headers['x-forwarded-proto'] || req.protocol;
       const fullUrl = protocol + '://' + thisHost + req.originalUrl;
       const parsedUrl = url.parse(fullUrl, true);

       //add url
       req.data.currentPath = parsedUrl.path;
       req.data.currentPathname = parsedUrl.pathname;
       req.data.currentUrl = fullUrl;

       /**
        * Fetch all ideas connected to the sites
        */
       if (globalData.siteId) {
         let ideas;

         // if cacheIdeas is turned on, get ideas from cache
         if (globalData.cacheIdeas) {
           ideas = cache.get('ideas-' + globalData.siteId);
         }

         // if cacheIdeas is turned on, get ideas from cache

         if (ideas && ideas.length > 0) {
           req.data.ideas = ideas;
           req.data.ideasVotedFor = ideas.filter(idea => idea.userVote);
           next();
         } else {
           const apiUrl = internalApiUrl ? internalApiUrl : self.apos.settings.getOption(req, 'apiUrl');

           const appUrl = self.apos.settings.getOption(req, 'appUrl');
           //const globalData = req.data.global;
           const sort = req.query.sort ? req.query.sort : 'createdate_desc';

           var options = {
                uri: `${apiUrl}/api/site/${globalData.siteId}/idea?sort=${sort}&includeUser=1&includeVoteCount=1&includeUserVote=1`,
                headers: headers,
                json: true // Automatically parses the JSON string in the response
          };

            rp(options)
              .then(function (ideas) {
                const ideaSlug = req.data.global.ideaSlug;
                const ideaOverviewSlug = req.data.global.ideaOverviewSlug;
                const protocol = req.headers['x-forwarded-proto'] || req.protocol;
                const googleMapsApiKey = self.apos.settings.getOption(req, 'googleMapsApiKey');

                ideas = ideas.map((idea) => {
                  let createdData = new Date(idea.createdAt);
                  idea.fullUrl = `${protocol}://${thisHost}/${ideaSlug}/${idea.id}`;
                  idea.overviewUrl = `${protocol}://${thisHost}/${ideaOverviewSlug}?ideaId=${idea.id}`;
                  idea.modBreakDateNice = dateFormat.format(idea.modBreakDate, 'D MMM YYYY, HH:mm');
                  idea.createdTime = createdData.getTime();
        //https://maps.googleapis.com/maps/api/staticmap?centwer=52.38731658066542,4.880186522135546&zoom=13&size=380x214&maptype=roadmap&markers=icon:https://buurtbudget.amsterdam.nl/westerpark/img/flag.svg|52.38731658066542,4.880186522135546&key=AIzaSyBUWkinf1yg1GpX71bv4zqx7icTxSX6oyU

                 if (idea.location && idea.location.coordinates[0] && idea.location.coordinates[1]) {
                   let lat = idea.location.coordinates[0];
                   let lng = idea.location.coordinates[1];
                   let flag = req.data.global.mapImageFlag ? 'flag-' + req.data.global.mapImageFlag : 'flag-red';
                   idea.locationMapImage = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=380x214&maptype=roadmap&markers=icon:${appUrl}/img/idea/${flag}.png|${lat},${lng}&key=${googleMapsApiKey}`;
                   idea.locationUrl = `https://maps.google.com/?ll=${lat},${lng}`;
                 }

                 return idea;
                });
                req.data.ideas = ideas;
                req.data.ideasVotedFor = ideas.filter(idea => idea.userVote);


                if (req.data.global.cacheIdeas) {
                  cache.set('ideas-' +req.data.global.siteId, req.data.ideas, {
                    life: 15*60,   // set lifespan of 15 minutes
                  });
                }

                next();
                return null;
              })
              .catch((e) => {
                console.log('===> e', e);
                next();
                return null;
              });
          }
       } else {
         next();
       }
     });

    const superPageBeforeSend = self.pageBeforeSend;

    self.pageBeforeSend = (req, callback) => {
      const pageData = req.data.page;

      /**
       * Currently runs double, also inn the idea-pages module, because wth query we want similar function
       * But needs to be in idea-pages to be able to throw a proper 404
       */
      const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;

       if (ideaId) {
         // req.data.ideas = enrichIdeas(ideas, googleMapsApiKey);
          req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(ideaId, 10)) : null;
          req.data.ideaId = ideaId;
      }

      if (pageData && pageData.notLoggedInRedirect && !req.data.loggedIn) {
        try {
          req.res.redirect(pageData.notLoggedInRedirect );
          return;
        }  catch(e) {
           console.log('===> e', e);
        //   next(e);
        }
      }

      req.data.messages =  {
        success: req.flash('success'),
        error: req.flash('error'),
        info: req.flash('info'),
      }

      return superPageBeforeSend(req, callback);

    };
    //});

    /*

    const superServeDeliver = self.serveDeliver;
    self.serveDeliver = (req, callback) => {
      const pageData = req.data.page;

      if (pageData && pageData.notLoggedInRedirect && !req.loggedIn) {
        req.redirectThisUrl(pageData.notLoggedInRedirect);
      }

      return superServeDeliver(req, callback);
    }

    */



  }


};
