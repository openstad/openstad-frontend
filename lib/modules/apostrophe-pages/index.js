// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu
const rp = require('request-promise');


module.exports = {
  types: [
    {
      name: 'default',
      label: 'Default'
    },
    {
      name: 'idea',
      label: 'Idea'
    }

    // Add more page types here, but make sure you create a corresponding
    // template in lib/modules/apostrophe-pages/views/pages!
  ],

  construct: function (self, options) {
     self.apos.app.use((req, res, next) => {
      const globalData = req.data.global;
      const csrf = self.apos.settings.getOption(req, 'csrf');

    //  const globalData = req.data.global;
      req.data.csrfToken = req.cookies[self.apos.csrfCookieName];

       const ideaId = req.params.ideaId ? req.params.ideaId : req.query.ideaId;
       const headers = {
         'Accept': 'application/json',
       };

       const thisHost = req.headers['x-forwarded-host'] || req.get('host');
       const fullUrl = req.protocol + '://' + thisHost + req.originalUrl;
       req.data.currentUrl = fullUrl;

       if (req.session.jwt) {
         headers["X-Authorization"] = `Bearer ${req.session.jwt}`;
       }
       /**
        *
        */
       if (globalData.siteId) {
         const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
         const appUrl = self.apos.settings.getOption(req, 'appUrl');
         //const globalData = req.data.global;
         const sort = req.query.sort ? req.query.sort : 'createdate_desc';

          var options = {
              uri: `${apiUrl}/api/site/${globalData.siteId}/idea?sort=${sort}&includeUser=1&includeVoteCount=1&includeUserVote=1&includeArguments=1`,
              headers: headers,
              json: true // Automatically parses the JSON string in the response
          };

          rp(options)
            .then(function (ideas) {
              const ideaSlug = req.data.global.ideaSlug;
              const ideaOverviewSlug = req.data.global.ideaOverviewSlug;

              ideas = ideas.map((idea) => {
                idea.fullUrl = `${req.protocol}://${thisHost}/${ideaSlug}/${idea.id}`;
                idea.overviewUrl = `${req.protocol}://${thisHost}/${ideaOverviewSlug}?ideaId=${idea.id}`;
                return idea;
              });

        //      console.log('--> ideas', ideas);

              req.data.ideas = ideas;
              next();
              return null;
            })
            .catch((e) => {
              console.log('===> e', e);
              next();
              return null;
            })
       } else {
         next();
       }
     });

    const superPageBeforeSend = self.pageBeforeSend;
    self.pageBeforeSend = (req, callback) => {
  //    console.log(req.data);
//    self.apos.app.use((req, res, next) => {

      const pageData = req.data.page;

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


      /**
       *

      if (globalData.siteId) {
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
         var options = {
             uri: `${apiUrl}/api/site/${globalData.siteId}/idea?sort=${req.query.sort}&includeUser=1&includeVoteCount=1&includeUserVote=1`,
             headers: {
                 'Accept': 'application/json',
         //         "Authorization" : auth
             },
             json: true // Automatically parses the JSON string in the response
         };

         rp(options)
           .then(function (ideas) {
             req.data.ideas = ideas;
        //     next();
             return superPageBeforeSend(req, callback);
           })
           .catch((e) => {
             console.log('===> e', e);
        //     next();
             return superPageBeforeSend(req, callback);
           })
      } else {
      //  next();
        return superPageBeforeSend(req, callback);
      }
*/
    };
    //});

    /*

    const superServeDeliver = self.serveDeliver;
    self.serveDeliver = (req, callback) => {
      const pageData = req.data.page;
      console.log('serveDeliver', pageData)

      if (pageData && pageData.notLoggedInRedirect && !req.loggedIn) {
        req.redirectThisUrl(pageData.notLoggedInRedirect);
      }

      return superServeDeliver(req, callback);
    }

    */



  }


};
