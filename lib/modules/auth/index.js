const rp = require('request-promise');
const url = require('url');
const apiLogoutUrl = process.env.API_LOGOUT_URL;

module.exports = {
  construct: function(self, options) {
  // You can add routes here
    self.apos.app.use((req, res, next) => {

      if (req.query.jwt) {
        // redirect to returnTo if set!
        let returnTo = req.session.returnTo ? req.session.returnTo : '/';
        // make sure reference to external urls fail
        returnTo = url.parse(returnTo, true);
        returnTo = returnTo.path;

        req.session.jwt = req.query.jwt;
        req.session.returnTo = null;

        req.session.save(() => {
          res.redirect(returnTo);
          return;
        });

      } else {
        const jwt = req.session.jwt;
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');

        if (!jwt) {
          next();
        } else {

				let url = req.data.global.siteId ? `${apiUrl}/oauth/site/${req.data.global.siteId}/me` : `${apiUrl}/oauth/me`;

         var options = {
             uri: url,
             headers: {
                 'Accept': 'application/json',
                 "X-Authorization" : `Bearer ${jwt}`,
                 "Cache-Control": "no-cache"
             },
             json: true // Automatically parses the JSON string in the response
         };

         rp(options)
           .then(function (user) {
             if (user) {
               req.data.loggedIn = user &&  user.role !== 'anonymous';
               req.data.openstadUser = user;
               req.data.isAdmin = user.role === 'admin'; // user;

               req.session.save(() => {
                 next();
               });


             } else {
               // if not valid clear the JWT and redirect
               req.session.jwt = '';
               req.session.save(() => {
                 res.redirect('/');
                 return;
               })
             }

           })
           .catch((e) => {
             // if not valid clear the JWT and redirect
             req.session.jwt = '';
             req.session.save(() => {
               res.redirect('/');
               return;
             })
           });

         }
      }
    });

    self.apos.app.get('/oauth/logout', (req, res, next) => {
      req.session.destroy(() => {
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        const thisHost = req.headers['x-forwarded-host'] || req.get('host');
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const fullUrl = protocol + '://' + thisHost;
        const url = apiUrl + '/oauth/site/'+req.data.global.siteId+'/logout?redirectUrl=' + fullUrl;
        res.redirect(url);
      });
    });

    self.apos.app.get('/oauth/login', (req, res, next) => {
        req.session.returnTo = req.query.returnTo ?  decodeURIComponent(req.query.returnTo) : null;

        req.session.save(() => {
          const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
          const thisHost = req.headers['x-forwarded-host'] || req.get('host');
          const protocol = req.headers['x-forwarded-proto'] || req.protocol;
          const fullUrl = protocol + '://' + thisHost;
          let url = `${apiUrl}/oauth/site/${req.data.global.siteId}/login?redirectUrl=${fullUrl}&forceNewLogin=1`;
          url = req.query.useOauth ? url + '&useOauth=' + req.query.useOauth : url;
          res.redirect(url);
        });
    });
  }
};
