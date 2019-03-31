module.exports = {
  construct: function(self, options) {
  // You can add routes here
    self.apos.app.use((req, res, next) => {
      const jwt = req.query.jwt;

      if (req.query.jwt) {
        console.log('auth 2');
        req.session.jwt = req.query.jwt;
        req.session.save(() => {
          res.redirect('/');
          return;
        })
      } else {

        /**
         * Add user call to make sure it's an active user.
         */
        req.data.loggedIn = !!req.session.jwt;
        next();
      }
    });

    self.apos.app.get('/oauth/login', (req, res, next) => {
      const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
      const appUrl = self.apos.settings.getOption(req, 'appUrl');

      const fullUrl =  appUrl + req.originalUrl;
      console.log('fullUrl', fullUrl);
      console.log('req.originalUrl', req.originalUrl);

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
