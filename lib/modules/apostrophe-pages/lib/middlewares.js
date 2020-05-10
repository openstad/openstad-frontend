const url             = require('url');
const cache           = require('../../../../services/cache').cache;
const cache_lifespan  = 15*60;   // set lifespan of 15 minutes;

module.exports = (self, options) => {

    /**
     * Load in the ideas from the api and set to the req object
     */
    self.apos.app.use(async (req, res, next) => {
        req.data.csrf = self.apos.settings.getOption(req, 'csrf');
        req.data.apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        req.data.appUrl = self.apos.settings.getOption(req, 'appUrl');
        req.data.googleMapsApiKey =  self.apos.settings.getOption(req, 'googleMapsApiKey');

        const sort = req.query.sort ? req.query.sort : 'createdate_desc';

        // Fixme: handle ideas caching in seperate class
        let ideas;
        if (req.data.global.cacheIdeas) {
            let cacheKey = 'ideas-' + req.data.global.siteId;
            ideas = cache.get(cacheKey);
        } else {
            ideas = await self.apos.openstad.getAllIdeas(req, req.data.global.siteId, sort);
        }

        // Fixme: don't use req as argument
        self.mapIdeas(req, ideas);

        next();
    });

    self.mapIdeas = (req, ideas) => {
        const globalData = req.data.global;

        const appUrl = req.data.appUrl;
        const googleMapsApiKey = req.data.googleMapsApiKey;

        const thisHost = req.headers['x-forwarded-host'] || req.get('host');
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const fullUrl = protocol + '://' + thisHost + req.originalUrl;
        const parsedUrl = url.parse(fullUrl, true);

        //add url
        req.data.currentPath = parsedUrl.path;
        req.data.currentPathname = parsedUrl.pathname;
        req.data.currentUrl = fullUrl;

        /**
         * Fetch all ideas connected to the sites
         */
        if (! globalData.siteId) {
            return null;
        }

        // if cacheIdeas is turned on, get ideas from cache
        if (globalData.cacheIdeas) {
            let cacheKey = 'ideas-' + globalData.siteId;
            ideas = cache.get(cacheKey);
        }

        // if cacheIdeas is turned on, get ideas from cache
        if (ideas && ideas.length > 0) {
            req.data.ideas = ideas;
            req.data.ideasVotedFor = ideas.filter(idea => idea.userVote);
            return;
        }

        const ideaSlug = req.data.global.ideaSlug;
        const ideaOverviewSlug = req.data.global.ideaOverviewSlug;

        /**
         * Format ideas data
         */
        ideas = ideas.map((idea) => {
            let createdData = new Date(idea.createdAt);
            idea.fullUrl = `${protocol}://${thisHost}/${ideaSlug}/${idea.id}`;
            idea.overviewUrl = `${protocol}://${thisHost}/${ideaOverviewSlug}?ideaId=${idea.id}`;
            idea.createdTime = createdData.getTime();

            if (idea.location && idea.location.coordinates[0] && idea.location.coordinates[1]) {
                let lat = idea.location.coordinates[0];
                let lng = idea.location.coordinates[1];
                let flag = req.data.global.mapImageFlag ? 'flag-' + req.data.global.mapImageFlag : 'flag-red';
                idea.locationMapImage = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=380x214&maptype=roadmap&markers=icon:${appUrl}/img/idea/${flag}.png|${lat},${lng}&key=${googleMapsApiKey}`;
                idea.locationUrl = `https://maps.google.com/?ll=${lat},${lng}`;
            }

            return idea;
        });

        //add ideas to to the data object so it's available in templates
        req.data.ideas = ideas;

        // filter the ideas the user voted for
        req.data.ideasVotedFor = ideas.filter(idea => idea.userVote);

        // Fixme: handle cache in seperate file
        // set the cache,
        if (req.data.global.cacheIdeas) {
            cache.set('ideas-' + req.data.global.siteId, req.data.ideas, {
                life: cache_lifespan
            });
        }

    }

};
