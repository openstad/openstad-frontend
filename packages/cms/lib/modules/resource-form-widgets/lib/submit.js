const rp = require('request-promise');
const eventEmitter  = require('../../../../events').emitter;

module.exports = async function(self, options) {


  // Almost identical  to proxy,
  // Server side validation is done by the API
  // In future form can probably talk directly with api proxy,
  // Only images need to be refactored
  self.route('post', 'submit', function(req, res) {
    // emit event
    eventEmitter.emit('resourceCrud');

    /**
     * Format API Url
     */
    const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
    const siteId = req.data.global.siteId;
    const postUrl = `${apiUrl}/api/site/${siteId}/${req.body.resourceEndPoint}`;

    /**
     * Format headerr
     */
    const httpHeaders = {
        'Accept': 'application/json',
    };

    if (req.session.jwt) {
      httpHeaders['X-Authorization'] = `Bearer ${req.session.jwt}`;
    }
    const data = req.body;

    data.extraData = data.extraData ? data.extraData : {};

    //format image
    if (data.image) {
      // when only one image filepondjs sadly just returns object, not array with one file,
      // to make it consistent we turn it into an array
      let images = data.image && typeof data.image === 'string' ? [data.image] : data.image;

      // format images
      images = images ? images.map(function(image) {
        image = JSON.parse(image);
        return image ? image.url : '';
      }) : [];

      // add the formatted images
      data.extraData.images = images;

      //clean up data object
      delete data.image;
   } else {
     data.extraData.images = [];
   }

    if (req.body.resourceType === 'submission') {
      data.submittedData = data.extraData;
      delete data.extraData;
    }

    if(req.body && req.body.areYouABot) {
      const captchaData = req.session.captcha;
      const isCaptchaValid = captchaData && captchaData.text && captchaData.text === req.body.areYouABot;
      
      if (!isCaptchaValid) {
          return res.status(403).json({
              'msg' : 'The captcha code is not correct, try again or refresh the captcha.'
          });
      }

      // clean up key before we send it to the api
      delete req.body.areYouABot;
    }

    const options = {
        method: req.body.resourceId ? 'PUT' : 'POST',
        uri: req.body.resourceId ? `${postUrl}/${req.body.resourceId}` : postUrl,
        headers: httpHeaders,
        body: data,
        json: true // Automatically parses the JSON string in the response
    };

    rp(options)
    .then(function (response) {
       res.setHeader('Content-Type', 'application/json');
       res.end(JSON.stringify({
         id: response.id
       }));
    })
    .catch(function (err) {
      console.error('err', err);
      let message = '';
      let statusCode = 500;

      if(err.hasOwnProperty("error") && !Array.isArray(err.error)) {
        message = err.error.message;
        statusCode = err.statusCode;
      } else if(err.hasOwnProperty("error")) {
        message = err.error[0];
      }

      res.setHeader('Content-Type', 'application/json');
      res.status(statusCode).end(JSON.stringify({
        msg: message
      }));
    });
  });
}
