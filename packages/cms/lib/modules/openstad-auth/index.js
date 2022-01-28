/**
 * The openstad-auth Module contains routes and logic for authenticating users with the openstad API
 * and if valid fetches the user data
 */

const rp = require('request-promise');
const Url = require('url');
const apiLogoutUrl = process.env.API_LOGOUT_URL;
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

module.exports = {
    construct: function (self, options) {
        self.expressMiddleware = {
            when: 'afterRequired',
            middleware: (req, res, next) => {
                var url = req.originalUrl;
                var method = req.method;
                var userId = req.user && req.user.id;
                var userRole = req.user && req.user.role;
                self.authenticate(req, res, next);
            }
        };

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


            /**
             * Add oAuth defaults to data object so it can be reused in the application
             */
            const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
            const oauthConfig = self.apos.settings.getOption(req, 'oAuthConfig');
            const oauthClientId = oauthConfig.default &&  oauthConfig.default["auth-client-id"] ? oauthConfig.default["auth-client-id"] : false;
            const returnTo = fullUrl;
            const redirectUrl = encodeURIComponent(apiUrl + '/oauth/site/' + req.site.id + '/digest-login?useOauth=default&returnTo=' + returnTo);

            req.data.oAuthRedirectUrl = redirectUrl;
            req.data.oAuthClientId = oauthClientId;

            if (req.query.jwt) {

                const thisHost = req.headers['x-forwarded-host'] || req.get('host');
                const protocol = req.headers['x-forwarded-proto'] || req.protocol;
                const fullUrl = protocol + '://' + thisHost + req.originalUrl;
                const cmsUrl = self.apos.settings.getOption(req, 'siteUrl');

                const parsedUrl = Url.parse(fullUrl, true);
                let fullUrlPath = parsedUrl.path;

                // remove the JWT Parameter otherwise keeps redirecting
                let returnTo = req.session.returnTo ? req.session.returnTo : removeURLParameter(fullUrlPath, 'jwt');

                const sitePrefix = req.sitePrefix ? '/' + req.sitePrefix : false;

                // incase the site prefix, this happens to be filled for a /subdir, make sure this is removed if it exists, otherwise it will be added double
                returnTo = sitePrefix && returnTo.startsWith(sitePrefix) ? returnTo.replace(sitePrefix, '') : returnTo;

                // in case full url is prefixed remove it, otherwise will also cause issues
                returnTo = cmsUrl && returnTo.startsWith(cmsUrl) ? returnTo.replace(cmsUrl, '') : returnTo;

                // make sure references to external urls fail, only take the path
                returnTo = Url.parse(returnTo, true);

                // make sure it's a string
                returnTo = returnTo.path ? returnTo.path : '';

                // always attach cmsUrl so no external redirects are possible and subdir is working
                returnTo = cmsUrl + returnTo;

                // add params so modules now it's a first time return from login
                // used in some cases like auto voting
                returnTo = returnTo.includes('?') ? returnTo + '&freshLogIn=1' : returnTo + '?freshLogIn=1';

                req.session.regenerate(function(err) { // work with a clean session
                  // set the JWT to session and redirect without it so it doens't get save to the browser history
                  req.session.jwt = req.query.jwt;

                  req.session.save(() => {
                    res.redirect(returnTo);
                    return;
                  });
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
                            "X-Authorization": `Bearer ${jwt}`,
                            "Cache-Control": "no-cache"
                        },
                        json: true // Automatically parses the JSON string in the response
                    };

                    const setUserData = function (req, next) {

                        const requiredRoles = ['member', 'moderator', 'admin', 'editor'];
                        const user = req.session.openstadUser;
                        req.data.loggedIn = user && user.role && requiredRoles.includes(user.role);
                        req.data.openstadUser = user;
                        // todo: een admin is ook moderaor en editor,  en een editor is ook moderator, maar ik kan de consequenties zo snel niet overzien dus dat nmoet later een keer
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

                    const THIRTY_SECONDS = 100; //30 * 1000;
                    const date = new Date();
                    const dateToCheck = req.session.lastJWTCheck ? new Date(req.session.lastJWTCheck) : new Date;

                    // apostropheCMS does a lot calls on page load
                    // if user is a CMS user and last api check was within 30 seconds use cached user
                    if (req.user && req.session.openstadUser && ((date - dateToCheck) < THIRTY_SECONDS)) {
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
                                        const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
                                        res.redirect(siteUrl + '/');
                                        return;
                                    });
                                }

                            })
                            .catch((e) => {
                                console.log('e', e);
                                req.session.destroy(() => {
                                    const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
                                    res.redirect(siteUrl + '/');
                                    return;
                                })
                            });
                    }
                }
            }
        };


        /**
         * When the user is admin, load in all the voting data
         * @type {[type]}

         self.apos.app.use((req, res, next) => {
      if (req.data.hasModeratorRights) {
        const apiUrl = internalApiUrl ? internalApiUrl : self.apos.settings.getOption(req, 'apiUrl');
        const jwt = req.session.jwt;

        rp({
            uri: `${apiUrl}/api/site/${req.data.global.siteId}/vote`,
            headers: {
                'Accept': 'application/json',
                "X-Authorization" : `Bearer ${jwt}`,
                "Cache-Control": "no-cache"
            },
            json: true // Automatically parses the JSON string in the response
        })
        .then(function (votes) {
          req.data.votes = votes;
          return next();
        })
        .catch((e) => {
          return next();
        });

      } else {
        return next();
      }
    });
         */


        self.apos.app.get('/oauth/logout', (req, res, next) => {

            req.session.destroy(() => {
                const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
                const fullUrl = self.apos.settings.getOption(req, 'siteUrl');
                const url = apiUrl + '/oauth/site/' + req.data.global.siteId + '/logout?redirectUrl=' + fullUrl;
                res.redirect(url);
            });
        });

        self.apos.app.get('/oauth-csrf', (req, res, next) => {
            //only allow AJAX requests, from trusted domains, otherwise there is no point to CSRF token
            if (!req.xhr) {
                return;
            }

            //auth-client-secret
            const oAuthUrl = self.apos.settings.getOption(req, 'oAuthUrl');
            const oauthConfig = self.apos.settings.getOption(req, 'oAuthConfig');
            const oauthClientId = oauthConfig.default &&  oauthConfig.default["auth-client-id"] ? oauthConfig.default["auth-client-id"] : false;
            const oauthClientSecret = oauthConfig.default && oauthConfig.default["auth-client-secret"] ? oauthConfig.default["auth-client-secret"] : false;

            if (oauthClientId && oauthClientSecret) {
                const authHeaders = JSON.stringify({
                    client_id: oauthClientId,
                    client_secret: oauthClientSecret
                });

                /**
                 * We are posting directly email, sms, code to the oAuth server.
                 * This means CSRF validation fails.
                 * In order for CSRF to work we fetch a token as admin an pass it to the request.
                 * Theoretically one can argue that since oAuth redirects are only allowed
                 * to restricted domains, it will be impossible to execute a CSRF login anyway.
                 * Most of the time pentesters will flag you for it anyway, because CSRF is a check on the list.
                 * Their argument for it not being needed is it CSRF might not be needed, if the redirect check fails
                 * or has a bug, then at least csrf is working.
                 *
                 * So this might not be necessary. For now we leave it in and consult with Security expert.
                 */

                rp({
                    url: `${oAuthUrl}/api/admin/csrf-session-token`,
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    body: authHeaders
                })
                .then((response) => {
                    if (response) {
                        response = JSON.parse(response);
                    }

                    res.json({
                        token: response.token
                    })
                })
                .catch((err) => {
                    console.log('oauth err', err)
                    next(err)
                })
            }
        });

        // nice route for admin login
        self.apos.app.get('/admin/login', (req, res, next) => {
            // empty openstadUser, this doesn't logout user
            // but clears it's session cache so it will be fetched freshly
            // this is necessary in case of voting or logging out
            if (req.session.openstadUser) {
                req.session.openstadUser = null;
            }

            req.session.save(() => {
                const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
                res.redirect(siteUrl + '/oauth/login?loginPriviliged=1');
            })
        });

        self.apos.app.get('/oauth/login', (req, res, next) => {
            // check in url if returnTo params is set for redirecting to page
            req.session.returnTo = req.query.returnTo ? decodeURIComponent(req.query.returnTo) : null;

            req.session.save(() => {
                const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
                const thisHost = req.headers['x-forwarded-host'] || req.get('host');
                const protocol = req.headers['x-forwarded-proto'] || req.protocol;
                let returnUrl = self.apos.settings.getOption(req, 'siteUrl');

                if (req.query.returnTo && typeof req.query.returnTo === 'string') {
                    //only get the pathname to prevent external redirects
                    let pathToReturnTo = Url.parse(req.query.returnTo, true);
                    pathToReturnTo = pathToReturnTo.path + ( pathToReturnTo.hash ? pathToReturnTo.hash : '' );
                    returnUrl = returnUrl + pathToReturnTo;
                }

                let url = `${apiUrl}/oauth/site/${req.data.global.siteId}/login?redirectUrl=${encodeURIComponent(returnUrl)}`;

                url = req.query.useOauth ? url + '&useOauth=' + req.query.useOauth : url;
                url = req.query.loginPriviliged ? url + '&loginPriviliged=1' : url + '&forceNewLogin=1';
                res.redirect(url);
            });
        });
    }
};
