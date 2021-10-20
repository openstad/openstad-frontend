/**
 * Image proxy, used to for uploading images proxying to image server, preventing CORS issues
 */
const proxy         = require('http-proxy-middleware');
const imageApiUrl   = process.env.IMAGE_API_URL;
const imageApiToken = process.env.IMAGE_API_ACCESS_TOKEN;

module.exports = {
    label: 'Image proxy',
    construct: function(self, options) {

        let imagePath = options.sitePrefix ? (options.sitePrefix + '/image' ) : '/image';
        let imagesPath = options.sitePrefix ? (options.sitePrefix + '/images') : '/images';

        // console.log('options.sitePrefix on image proxy', options.sitePrefix);

        function checkUserMiddlware(req, res, next) {
            if (!req.data.loggedIn) return next(new Error('No user found'));  // loggedIn is created in the openstad-auth module and checked against requiredRoles = ['member', 'moderator', 'admin', 'editor'];
            return next();
        }

        /**
         * Create route for proxying one image to image server, add api token in header
         */
        self.apos.app.use('/image', checkUserMiddlware, proxy({
            target: imageApiUrl,
            changeOrigin: true,
            pathRewrite: {['^' + imagePath] : '/image'},
            onProxyReq : (proxyReq, req, res) => {
                // add custom header to request
                proxyReq.setHeader('Authorization', `Bearer ${imageApiToken}`);
            }
        }));

        /**
         * Create route for proxying multiples images to image server, add api token in header
         */
        self.apos.app.use('/images', checkUserMiddlware, proxy({
            target: imageApiUrl,
            pathRewrite: {['^' + imagesPath] : '/images'},
            changeOrigin: true,
            onProxyReq : (proxyReq, req, res) => {
                // add custom header to request
                proxyReq.setHeader('Authorization', `Bearer ${imageApiToken}`);
            }
        }));
    }
};
