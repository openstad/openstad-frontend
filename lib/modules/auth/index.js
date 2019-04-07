const rp = require('request-promise');

module.exports = {
  construct: function(self, options) {
  // You can add routes here
    self.apos.app.use((req, res, next) => {
      if (req.query.jwt) {
        req.session.jwt = req.query.jwt;
        req.session.save(() => {
          res.redirect('/');
          return;
        })
      } else {
        const jwt = req.session.jwt;
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');

        if (!jwt) {
          next();
        } else {

         var options = {
             uri: `${apiUrl}/oauth/me`,
             headers: {
                 'Accept': 'application/json',
                 "X-Authorization" : `Bearer ${jwt}`,
             },
             json: true // Automatically parses the JSON string in the response
         };

         rp(options)
           .then(function (user) {
             if (user) {
               req.data.loggedIn = true;
               req.data.user = user;
               next();
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
           })
         }
      }
    });

    self.apos.app.get('/oauth/login', (req, res, next) => {
      const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
      const thisHost = req.headers['x-forwarded-host'] || req.get('host');
      const fullUrl = req.protocol + '://' + thisHost + req.originalUrl;
      const url = apiUrl + '/oauth/login?redirectUrl=' + fullUrl;

      res.redirect(url);
    });

    self.apos.app.get('/oauth/logout', (req, res, next) => {
      req.session.destroy(() => {
        res.redirect('/');
      });
    });
  }
};
