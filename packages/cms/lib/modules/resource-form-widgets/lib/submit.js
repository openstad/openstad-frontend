const rp = require('request-promise');
const eventEmitter = require('../../../../events').emitter;

module.exports = async function (self, options) {


    // Almost identical  to proxy,
    // Server side validation is done by the API
    // In future form can probably talk directly with api proxy,
    // Only images need to be refactored
    self.route('post', 'submit', async function (req, res, next) {
        // emit event
        eventEmitter.emit('resourceCrud');

        /**
         * Format API Url
         */
        const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
        const siteId = req.data.global.siteId;
        const postUrl = req.body.resourceEndPoint === 'site' ? `${apiUrl}/api/site` : `${apiUrl}/api/site/${siteId}/${req.body.resourceEndPoint}`;

        /**
         * Format headerr
         */
        const httpHeaders = {
            'Accept': 'application/json'
        };

        if (req.session.jwt) {
            httpHeaders["X-Authorization"] = `Bearer ${req.session.jwt}`;
        }

        const data = req.body;

        data.extraData = data.extraData ? data.extraData : {};

        //format image
        if (data.image) {
            // when only one image filepondjs sadly just returns object, not array with one file,
            // to make it consistent we turn it into an array
            let images = data.image && typeof data.image === 'string' ? [data.image] : data.image;

            // format images
            images = images ? images.map(function (image) {
                image = JSON.parse(image);
                return image ? image.url : '';
            }) : [];

            // add the formatedd images
            data.extraData.images = images;

            //clean up data object
            delete data.image;
        } else {
            data.extraData.images = [];
        }

        /**
         * In case secrets are set validate
         */
        if (req.data.recaptchaSecret) {
            try {
                const VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${req.data.recaptchaSecret}&response=${encodeURIComponent(req.body['recaptcha'])}`;
                let recaptchaResponse = await rp(VERIFY_URL, {method: 'POST'});
                recaptchaResponse = recaptchaResponse ? JSON.parse(recaptchaResponse) : '';

                if (!recaptchaResponse.success) {
                    throw new Error('Bot validation failed, Google thinks you are a bot. If not please refresh and retry')
                }
            } catch(e) {
                console.log('e',e)
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).end(JSON.stringify({
                    msg: e.message
                }));
            }
        }

        const options = {
            method: req.body.resourceId ? 'PUT' : 'POST',
            uri: req.body.resourceId ? `${postUrl}/${req.body.resourceId}` : postUrl,
            headers: httpHeaders,
            body: data,
            json: true // Automatically parses the JSON string in the response
        };

        console.log('options', options)

        rp(options)
            .then(function (response) {
                res.setHeader('Content-Type', 'application/json');
                console.log('response',response )
                res.end(JSON.stringify(response));
            })
            .catch(function (err) {
                console.log('err', err.message);
                console.log('err.status', err.statusCode);

                res.setHeader('Content-Type', 'application/json');

                res.status(err.statusCode).end(JSON.stringify({
                    status: err.statusCode,
                    msg: err.message
                }));
            });
    });
}
