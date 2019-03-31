module.exports = {
  construct: function(self, options) {
  // You can add routes here
    self.apos.app.use((req, res, next) => {
      const jwt = req.query.jwt;

      console.log('auth 1');


      if (req.query.jwt) {
        console.log('auth 2');

        req.session.jwt = req.query.jwt;
        req.session.save(() => {
          res.redirect('/');
          return;
        })
      } else {
        console.log('auth 3');

        /**
         * Add user call to make sure it's an active user.
         */
        req.data.loggedIn = !!req.session.jwt;
        next();
      }
    });

    self.apos.app.get('/oauth/login', (req, res, next) => {
      const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
      const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
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
