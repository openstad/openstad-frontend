module.exports = {
  construct: function(self, options) {
  // You can add routes here
    self.apos.app.use((req, res, next) => {
      const jwt = req.query.jwt;
      if (req.query.jwt) {
        req.session.jwt = req.query.jwt;

        req.session.save(() => {
          res.redirect('/');
        })
      }

      req.data.loggedIn = !!req.session.jwt;
      next();
    });

    self.apos.app.get('/oauth/login', (req, res, next) => {
      console.log('====> oauth login login login');
      const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
      const appUrl = self.apos.settings.getOption(req, 'appUrl');
      res.redirect(apiUrl + '/oauth/login?redirectUrl=' + appUrl);
      next();
    });

    self.apos.app.get('/oauth/logout', (req, res, next) => {
      req.session.destroy(() => {
        res.redirect('/')
      });
    });

  }
};
