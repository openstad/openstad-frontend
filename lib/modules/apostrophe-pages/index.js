// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu
const rp = require('request-promise');


module.exports = {
  types: [
    {
      name: 'home',
      label: 'Home'
    },
    {
      name: 'idea',
      label: 'Idea'
    }

    // Add more page types here, but make sure you create a corresponding
    // template in lib/modules/apostrophe-pages/views/pages!
  ],

  construct: function (self, options) {
    const superPageBeforeSend = self.pageBeforeSend;
    self.pageBeforeSend = (req, callback) => {
  //    console.log(req.data);
//    self.apos.app.use((req, res, next) => {

      const pageData = req.data.page;
      const globalData = req.data.global;

      if (pageData) {
        console.log(pageData.notLoggedInRedirect);
      }

      if (pageData && pageData.notLoggedInRedirect && !req.data.loggedIn) {
        try {
          req.res.redirect(pageData.notLoggedInRedirect);
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
      console.log('req.data.messages', req.data.messages );

      /**
       *
       */
      if (globalData.siteId) {
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
         var options = {
             uri: `${apiUrl}/api/site/${globalData.siteId}/idea?sort=${req.query.sort}`,
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
