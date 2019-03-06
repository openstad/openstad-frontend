module.exports = {
  construct: function(self, options) {
  // You can add routes here

  console.log('=====>>>>>>');

    self.apos.app.use((req, res, next) => {
      const jwt = req.query.jwt;

      if (req.query.jwt) {
        req.session.jwt = req.query.jwt;
        req.session.save(() => {
          res.redirect('/');
        })
      }

      console.log('==> aaaa', req.loggedIn);


      /**
       * Add user call to make sure it's an active user.
       */
      req.data.loggedIn = !!req.session.jwt;
      next();
    });

    self.apos.app.get('/oauth/login', (req, res, next) => {
      const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
      const appUrl = self.apos.settings.getOption(req, 'appUrl');
      const url = apiUrl + '/oauth/login?redirectUrl=' + appUrl;

      return res.redirect(url);
    });

    self.apos.app.get('/oauth/logout', (req, res, next) => {
      req.session.destroy(() => {
        res.redirect('/');
      });
    });
  }
};
