/**
 * Api proxy allows for directly calling the API with ajax
 */
const proxy = require('http-proxy-middleware');
const apiUrl = process.env.API;
const eventEmitter = require('../../../events').emitter;

module.exports = {
    construct: function (self, options) {

        const apiPath = options.sitePrefix ? options.sitePrefix + '/api' : '/api';



        /*
         * Create api route for proxying api so we don't have cross origin errors when making AJAX requests
         */
        self.apos.app.use('/api', proxy({
            target: apiUrl,
            changeOrigin: true,
            pathRewrite: {['^' + apiPath]: '/api'},
            onProxyReq: (proxyReq, req, res) => {

                /**
                 * Validate the request with captcha if send by a form
                 */
                if (req.body && req.body.areYouABot) {
                    const captchData = req.session.captcha;
                    const isCaptchaValid = captchData && captchData.text && captchData.text === req.body.areYouABot;
                    const shouldCheckCaptcha = req.data && req.data.global && req.data.global.useCaptchaForNewsletter !== false;
                    
                    if (shouldCheckCaptcha && !isCaptchaValid) {
                        return res.status(403).json({
                            'message' : self.apos.i18n.__('The captcha code is not correct, try again or refresh the captcha.')
                        });
                    }

                    // clean up key before we send it to the api
                    delete req.body.areYouABot;
                }

                // add custom header to request
                proxyReq.setHeader('Accept', 'application/json');
                proxyReq.setHeader('Content-Type', 'application/json; charset=utf-8');

                if (req.session.jwt) {
                    proxyReq.setHeader('X-Authorization', `Bearer ${req.session.jwt}`);
                }

                //bodyParser middleware parses the body into an object
                //for proxying to worl we need to turn it back into a string
                if (req.method == "POST" || req.method == "PUT" || req.method == "DELETE") {
                    eventEmitter.emit('apiPost');
                }

                // empty openstadUser, this doesn't logout user
                // but clears it's session cache so it will be fetched freshly
                // this is necessary in case of voting or logging out
                if (req.session.openstadUser) {
                    req.session.openstadUser = null;
                }

                if ((req.method == "POST" || req.method == "PUT") && req.body) {
                    // emit event
                    let body = req.body;
                    let newBody = '';
                    delete req.body;

                    // turn body object  back into a string
                    //let newBody = qs.stringify(body, { skipNulls: true })
                    try {
                        newBody = JSON.stringify(body);
                        proxyReq.setHeader('content-length', Buffer.byteLength(newBody, 'utf8'));
                        proxyReq.write(newBody);
                        proxyReq.end();
                    } catch (e) {
                        console.log('stringify err', e)
                    }
                }

            },
            onError: function (err) {
                console.log('errerrerr newBody', err);
            }
        }));

        const statsPath = options.sitePrefix ? options.sitePrefix + '/stats' : '/stats'



        /*
        * Create api route for proxying api so we don't have cross origin errors when making AJAX requests
        */
        self.apos.app.use('/stats', proxy({
            target: apiUrl,
            changeOrigin: true,
            pathRewrite: {['^' + statsPath]: '/stats'},
            onProxyReq: (proxyReq, req, res) => {

                // add custom header to request
                proxyReq.setHeader('Accept', 'application/json');

                if (req.session.jwt) {
                    proxyReq.setHeader('X-Authorization', `Bearer ${req.session.jwt}`);
                }

            },
            onError: function (err) {
                //console.log('errerrerr newBody', err);
            }
        }));




    }
};
