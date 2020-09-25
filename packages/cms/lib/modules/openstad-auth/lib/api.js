const rp = require('request-promise');
const Url = require('url');
const internalApiUrl = process.env.INTERNAL_API_URL;

function removeURLParameter(url, parameter) {
  //prefer to use l.search if you have a location/link object
  var urlparts = url.split('?');
  if (urlparts.length >= 2) {

    var prefix = encodeURIComponent(parameter) + '=';
    var pars = urlparts[1].split(/[&;]/g);

    //reverse iteration as may be destructive
    for (var i = pars.length; i-- > 0;) {
      //idiom for string.startsWith
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }

    return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
  }
  return url;
}

module.exports = (self, options) => {

  // You can add routes here
  self.authenticate = (req, res, next) => {

    //apostropheCMS for some reasons always sets the scene to user
    //this means it always assumes the user is logged in into the CMS
    req.scene = req.user ? 'user' : 'anon';

    const thisHost = req.headers['x-forwarded-host'] || req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const fullUrl = protocol + '://' + thisHost + req.originalUrl;
    const parsedUrl = Url.parse(fullUrl, true);
    let fullUrlPath = parsedUrl.path;

    //add apostrophes permissions function to the data object so we can check it in the templates
    req.data.userCan = function (permission) {
      return self.apos.permissions.can(req, permission);
    };

    if (req.query.jwt) {
      const thisHost = req.headers['x-forwarded-host'] || req.get('host');
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const fullUrl = protocol + '://' + thisHost + req.originalUrl;
      const parsedUrl = Url.parse(fullUrl, true);
      let fullUrlPath = parsedUrl.path;

      // remove the JWT Parameter otherwise keeps redirecting
      let returnTo = req.session.returnTo ? req.session.returnTo : removeURLParameter(fullUrlPath, 'jwt');

      // make sure references to external urls fail, only take the path
      returnTo = Url.parse(returnTo, true);
      returnTo = returnTo.path;
      req.session.jwt = req.query.jwt;
      req.session.returnTo = null;

      req.session.save(() => {
        res.redirect(returnTo);
        return;
      });

    } else {
      const jwt = req.session.jwt;
      const apiUrl = internalApiUrl ? internalApiUrl : self.apos.settings.getOption(req, 'apiUrl');

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

        const setUserData = function (req, next) {

          const requiredRoles = ['member', 'moderator', 'admin', 'editor'];
          const user = req.session.openstadUser;
          req.data.loggedIn = user &&  user.role && requiredRoles.includes(user.role);
          req.data.openstadUser = user;
          req.data.isAdmin = user.role === 'admin'; // user;
          req.data.isEditor = user.role === 'editor'; // user;
          req.data.isModerator = user.role === 'moderator'; // user;
          req.data.jwt = jwt;

          if (req.data.isAdmin || req.data.isEditor || req.data.isModerator) {
            req.data.hasModeratorRights = true;
          }


          req.session.save(() => {
            next();
          });
        }

        const FIVE_MINUTES =5*60*1000;
        const date = new Date();
        const dateToCheck = req.session.lastJWTCheck ? new Date(req.session.lastJWTCheck) : new Date;


        if (req.session.openstadUser && ((date - dateToCheck) < FIVE_MINUTES)) {
          setUserData(req, next);
        } else {
          rp(options)
            .then(function (user) {
              if (user && Object.keys(user).length > 0 && user.id) {
                req.session.openstadUser = user;
                req.session.lastJWTCheck = new Date().toISOString();

                setUserData(req, next)
              } else {
                // if not valid clear the JWT and redirect
                req.session.destroy(() => {
                  res.redirect('/');
                  return;
                });
              }

            })
            .catch((e) => {
              console.log('e', e);

              // if not valid clear the JWT and redirect
              // ;
              req.session.destroy(() => {
                res.redirect('/');
                return;
              })
            });
        }
      }
    }
  };
};
