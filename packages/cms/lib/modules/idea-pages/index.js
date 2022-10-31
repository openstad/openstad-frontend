/**
 * Will be deprecated in the feature, see resource page
 * Still contains logic for like anonymously
 *
 * After redirect user to oAuth to get a JWT
 * It comes back to CMS where a page is rendered so a form can be submitted.
 * The users sees a loader, after success is redirect to the initial page where the like button was clicked.
 *
 * After this is done the user can simply like without awkwad redirect and using ajax.
 *
 * It's not the most user friendly flows, but for oAuth it's required to redirect and
 * this allows for using some auth flow as the other auth methods and allows for adminstrators to define which fields are required
 * Even though no e-mail or phone nr is required, often a postal code is asked for.
 *
 * Anonymous voting is highly problematic, since it allows users to vote with authenticating with e-mail.
 * Therefore abuse is happening all the time.
 * It's possible to enable/disable it in siteconfig.
 *
 * This is allowed to keep it to a minimum. In order to not make it too easy an IP can only add one positive or negative vote per 5 minutes (at time of writing)
 * This type of voting is only being used for liking of ideas where it doesn't all too much influence on the decision making process.
 *
 */
const rp = require('request-promise');
const Url = require('url');
const eventEmitter = require('../../../events').emitter;

module.exports = {
    extend: 'apostrophe-custom-pages',
    name: 'idea',
    construct: function (self, options) {
        self.dispatch('/:ideaId', (req, callback) => {
            req.data.ideaId = req.params.ideaId;
            //    req.data.idea = req.data.ideas ? req.data.ideas.find(idea => idea.id === parseInt(req.data.ideaId, 10)) : null;

            if (req.data.ideaId && !req.data.idea) {
                //  req.notFound = true;
            }

            const globalData = req.data.global;
            const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
            const appUrl = self.apos.settings.getOption(req, 'appUrl');
            const headers = {
                'Accept': 'application/json',
            };

            if (req.session.jwt) {
                headers["X-Authorization"] = `Bearer ${req.session.jwt}`;
            }

            var options = {
                uri: `${apiUrl}/api/site/${globalData.siteId}/idea/${req.data.ideaId}?includeUser=1&includeVoteCount=1&includeUserVote=1&includeArguments=1&includeTags=1`,
                headers: headers,
                json: true // Automatically parses the JSON string in the response
            };

            /**
             * Add the arguments to the idea object.
             * The rest of the data is already present
             * Also some data is formatted already so we dont overwrite the whole object
             */
            rp(options)
                .then(function (idea) {
                    req.data.idea = idea;
                    // because we now have dynamic resource widgets and urls, the idea is also called
                    // plan is to phase this module out
                    req.data.activeResource = idea;
                    req.data.activeResourceType = 'idea';

                    if (idea.argumentsAgainst) {
                        req.data.idea.argumentsAgainst = idea.argumentsAgainst;
                    }

                    if (idea.argumentsFor) {
                        req.data.idea.argumentsFor = idea.argumentsFor;
                    }

                    req.data.idea.extraData = idea.extraData;
                    req.data.idea.user = idea.user;

                    if (req.data.hasModeratorRights) {
                        rp({
                            uri: `${apiUrl}/api/site/${req.data.global.siteId}/vote?ideaId=${req.data.ideaId}`,
                            headers: headers,
                            json: true // Automatically parses the JSON string in the response
                        })
                            .then(function (votes) {
                                req.data.ideaVotes = votes;
                                return callback(null);
                            })
                            .catch((e) => {
                                return callback(null);
                            });
                    } else {
                        callback(null);
                    }

                })
                .catch((e) => {
                    //if user not logged into CMS in throw 404
                    //for ease of use when someone is logged into CMS it's easier to allow
                    //editing also when no activeResource is present
                    if (!req.user) {
                        req.notFound = true;
                    }

                    callback(null);
                });
        });

        self.apos.app.get('/like', (req, res, next) => {
            if (
                req.data.global.siteConfig && req.data.global.siteConfig.votes
                && req.data.global.siteConfig.votes.voteType !== 'likes'
            ) {
                throw Error('GET Route only allowed for vote type like');
            }
            const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
            const siteId = req.data.global.siteId;
            const siteUrl = self.apos.settings.getOption(req, 'siteUrl');
            const sitePrefix = '/' + req.sitePrefix;

            let ideaSlug = req.data.global.ideaSlug;
            let redirectUrl  = ideaSlug && req.query.redirectUrl ? req.query.redirectUrl : (ideaSlug.match(/\{ideaId\}/i) ? `/${ideaSlug.replace(/\{ideaId\}/ig, req.query.ideaId)}` : `/${ideaSlug}/${req.query.ideaId}` );
            // incase the site prefix, this happens to be filled for a /subdir, make sure this is removed if it exists, otherwise it will be added double
            redirectUrl = sitePrefix && redirectUrl.startsWith(sitePrefix) ? redirectUrl.replace(sitePrefix, '') : redirectUrl;
            // in case full url is prefixed remove it, otherwise will also cause issues
            redirectUrl = siteUrl && redirectUrl.startsWith(siteUrl) ? redirectUrl.replace(siteUrl, '') : redirectUrl;
            redirectUrl = siteUrl + redirectUrl;
            req.redirectUrl = redirectUrl;

            req.data.formToSubmit = {
                url: `/api/site/${siteId}/vote`,
                method: 'post',
                fields: [
                    {
                        name: 'ideaId',
                        value: req.query.ideaId,
                    },
                    {
                        name: 'opinion',
                        value: req.query.opinion ? req.query.opinion : 'yes',
                    },
                    {
                        class: 'redirect-url',
                        name: 'redirectUrl',
                        value: redirectUrl,
                    },
                    {
                        class: 'redirect-error-url',
                        name: 'redirectErrorUrl',
                        value: redirectUrl,
                    },
                ]
            }

            return self.sendPage(req, 'form-to-submit', {});
        });

        const postVote = (req, res, next) => {

            // todo: waaarom gebruikt dit niet de api proxy?
            eventEmitter.emit('voted');

            const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
            const siteId = req.data.global.siteId;
            const postUrl = `${apiUrl}/api/site/${siteId}/vote`;
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

            let votes = req.body.votes ? req.body.votes : [{
                ideaId: req.body.ideaId,
                opinion: req.body.opinion,
            }];

            const options = {
                method: 'POST',
                uri: postUrl,
                headers: {
                    'x-forwarded-for': ip,
                    'Accept': 'application/json',
                    "X-Authorization": `Bearer ${req.session.jwt}`,
                },
                body: votes,
                json: true // Automatically parses the JSON string in the response
            };

            rp(options)
                .then(function (response) {
                    if (req.redirectUrl) {
                        var redirectUrl = Url.parse(req.redirectUrl);
                        redirectUrl = redirectUrl ? redirectUrl.pathname : '/';
                        res.redirect(redirectUrl);
                    } else {
                        res.end(JSON.stringify({
                            id: response.id
                        }));
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    let statusCode = err && err.statusCode || 500
                    res.status(statusCode).json(err);
                });
        }


        self.apos.app.post('/vote', (req, res, next) => {
            postVote(req, res, next);
        });

        const superPageBeforeSend = self.pageBeforeSend;

        self.pageBeforeSend = (req, callback) => {
            const pageData = req.data.page;

            // console.log('req.query.voteOpinion', req.query.voteOpinion);

            if (req.query.voteOpinion && req.query.ideaId) {
                req.res.redirect(`/like?ideaId=${req.query.ideaId}&opinion=${req.query.voteOpinion}&redirectUrl=${req.data.currentPathname}`)
            }

            callback();
            return superPageBeforeSend(req, callback);
        };

    }
};
