/**
 * Cache plugin for caching ApostropheCMS pages
 *
 * For most anonymous page visits static content can be rendered directly from the cache,
 * saving a lot in performance
 *
 * This module saves HTML response by overwriting ApostropheCMS function renderPageForModule
 *
 * We serve the cache from in app.js before apos even gets booted for best performance
 *
 * In Express Middleware logic is added that decides weather a user session should remain being served from cache
 * Or gets
 *
 * Conditions for cache are found in cache.request.shouldBeCached
 *
 * Uses standard cache module of Openstad this gets emptied on every api request done through the proxy
 */
const cache = require('../../../services/cache').cache;
const qs = require('qs');

module.exports = {
    name: 'openstad-template-cache',
    improve: 'apostrophe-templates',
    construct(self, options) {
        /**
         *
         */
        self.expressMiddleware = {
            // If you need to run the middleware very early, the object may also have a
            // `when` property, which may be set to `beforeRequired` (the absolute
            // beginning, before even req.body is available), `afterRequired` (after all
            // middleware shipped with apostrophe-express but before all middleware passed
            // to it as options), or `afterConfigured` (the default, with other module
            // middleware).
            when: 'afterRequired',
            middleware: async (req, res, next) =>  {
                const noCacheIsSet = req.cookies.noPageCache !== true;
                const shouldAddNoCache = req.query.jwt || !!(req.session && req.session.openstadUser);



                if (!noCacheIsSet && shouldAddNoCache) {
                    myCache.request.setNoCacheForThisSession(req, res);
                }

                // in case no cache is set, but req.session

                if (noCacheIsSet && !shouldAddNoCache) {
                    cache.request.clearNoCache(req, res);
                }

                next();
            }
        };

        // this is the ApostropheCMS function for rendering a page in HTML
        const superRenderPageForModule = self.renderPageForModule;

        self.renderPageForModule = (req, template, data, module) => {
            let content = superRenderPageForModule(req, template, data, module);

            if (cache.request.shouldBeCached(req)) {
                const cacheKey = cache.request.getCacheKey(req);

                cache.set(cacheKey, content, {
                    life: cache.request.cacheLifespan
                });
            }

            return content;
        }
    }
};
