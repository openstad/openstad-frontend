module.exports = {
  construct: function(self, options) {
  // You can add routes here
    self.apos.app.use((req, res, next) => {
      const jwt = req.query.jwt;
      console.log('req.query.jwt', req.query.jwt);

      if (req.query.jwt) {
        req.session.jwt = req.query.jwt;
        console.log('req.session', req.session);

        console.log('req.session.jwt', req.query.jwt);

        console.log('req.session.jwt', req.session.jwt);

        req.session.save(() => {
          res.redirect('/');
        })
      }
      console.log('req.session.jwt', req.session.jwt);

      req.data.loggedIn = !!req.session.jwt;

      next();
    });

    self.apos.app.get('/oauth/login', (req, res, next) => {
      res.redirect('https://api.staging.openstadsdeel.nl/oauth/login?redirectUrl=http://localhost:3000/')
      next();
    });

    self.apos.app.get('/oauth/logout', (req, res, next) => {
      req.session.destroy(() => {
        res.redirect('/')
      });
    });

  }
};
