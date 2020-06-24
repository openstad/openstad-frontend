const Url = require('url');

module.exports = (self, options) => {

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

  // nice route for admin login
  self.apos.app.get('/admin/login', (req, res, next) => {
    res.redirect('/oauth/login?loginPriviliged=1');
  });

  self.apos.app.get('/oauth/login', (req, res, next) => {
    // check in url if returnTo params is set for redirecting to page
    req.session.returnTo = req.query.returnTo ?  decodeURIComponent(req.query.returnTo) : null;

    req.session.save(() => {
      const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
      const thisHost = req.headers['x-forwarded-host'] || req.get('host');
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      let returnUrl = protocol + '://' + thisHost;

      if (req.query.returnTo) {
        //only get the pathname to prevent external redirects
        let pathToReturnTo = Url.parse(req.query.returnTo, true);
        pathToReturnTo = pathToReturnTo.path;
        returnUrl = returnUrl + pathToReturnTo;
      }

      let url = `${apiUrl}/oauth/site/${req.data.global.siteId}/login?redirectUrl=${returnUrl}`;
      url = req.query.useOauth ? url + '&useOauth=' + req.query.useOauth : url;
      url = req.query.loginPriviliged ? url + '&loginPriviliged=1' : url + '&forceNewLogin=1';
      res.redirect(url);
    });
  });
  
};


