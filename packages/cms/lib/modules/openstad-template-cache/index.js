/**
 * Cache plugin for caching ApostropheCMS pages
 *
 * For most anonymous/member page visits static content can be rendered directly from the cache,
 * saving a lot in performance
 *
 * This module saves HTML response by overwriting ApostropheCMS function renderPageForModule
 *
 * Then Ssrves cached content in the expressMiddleware, this is called after some logic is run
 * like Auth, and data.global is filled but not much more.
 *
 * Conditions for cache are found in shouldRequestBeCached
 *
 * Uses standard cache of Openstad this gets emptied on every api request done through the proxy
 */
const cache = require('../../../services/cache').cache;
const qs = require('qs');
const cacheLifespan = 15 * 60;   // set lifespan of 15 minutes;

module.exports = {
    name: 'openstad-template-cache',
    improve: 'apostrophe-templates',
    construct(self, options) {
        /**
         * We serve the cache from the middleware
         */
        self.expressMiddleware = {
            // If you need to run the middleware very early, the object may also have a
            // `when` property, which may be set to `beforeRequired` (the absolute
            // beginning, before even req.body is available), `afterRequired` (after all
            // middleware shipped with apostrophe-express but before all middleware passed
            // to it as options), or `afterConfigured` (the default, with other module
            // middleware).
            when: 'afterRequired',
            middleware: (req, res, next) => {
                const cacheKey = self.formatCacheKey(req);
                const cachedResponse = cache.get(cacheKey);

                if (cachedResponse && self.shouldRequestBeCached(req)) {
                    return req.res.send(cachedResponse);
                } else {
                    // in case cache requirements are met,
                    // call self.sendPage();
                    next();
                }

            }
        };

        self.formatCacheKey = (req) => {
            let cookieConsent = req.cookies && req.cookies['cookie-consent'] || 0;
            let key = encodeURIComponent(`${req.site.id}-${cookieConsent}-${req.url}?${qs.stringify(req.query)}`);
            return key
        }

        // check if it's a request that should be cached
        self.shouldRequestBeCached = (req) => {
            // APOS auth logic have not yet taken place
            // check if user is logged in directly in session
            // and check if user doesn't have a moderator role
            // only cache GET requests
           // const moderatorRoles = ['member', 'moderator', 'admin'];

            // only cache non logged in requests
            return req.method === 'GET' && (!req.session || !req.session.jwt);
                //(!req.session.openstadUser || (req.session.openstadUser && !moderatorRoles.includes(req.session.openstadUser.role)))
        }

        // this is the ApostropheCMS function for rendering a page in HTML
        const superRenderPageForModule = self.renderPageForModule;

        self.renderPageForModule = (req, template, data, module) => {
            let content = superRenderPageForModule(req, template, data, module);

            if (self.shouldRequestBeCached(req)) {
                const cacheKey = self.formatCacheKey(req);

                cache.set(cacheKey, content, {
                    life: cacheLifespan
                });
            }

            return content;
        }
    }
};
