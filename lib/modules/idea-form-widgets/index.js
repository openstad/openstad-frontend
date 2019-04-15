const rp = require('request-promise');
const proxy = require('http-proxy-middleware');
const url = require('url');
const request = require('request');

const imageApiUrl = process.env.IMAGE_API_URL;
const imageApiToken = process.env.IMAGE_API_ACCESS_TOKEN;


module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Idea form',
  addFields: [
   {
      name: 'redirect',
      type: 'string',
      label: 'Redirect after submit',
      required: true
    },
 ],
 construct: function(self, options) {
   /**
    * Create route for proxying one image to image server, add api token in header
    */
   self.apos.app.use('/image', proxy({
     target: imageApiUrl,
     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {
        // add custom header to request
        proxyReq.setHeader('Authorization', `Bearer ${imageApiToken}`);
     }
   }));

   /**
    * Create route for proxying multiples images to image server, add api token in header
    */
   self.apos.app.use('/images', proxy({
     target: imageApiUrl,
     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {
        // add custom header to request
        proxyReq.setHeader('Authorization', `Bearer ${imageApiToken}`);
     }
   }));

   /**
    * Create route for fetching images by GET from the server
    */
   self.apos.app.use('/fetch-image', (req, res, next) => {
     const imageUrl = req.query.img;
     request.get(imageUrl).pipe(res);
   });

   self.route('post', 'submit', function(req, res) {
     const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
     const appUrl = self.apos.settings.getOption(req, 'appUrl');
     const siteId = req.data.global.siteId;

     // when only one image filepondjs sadly just returns object, not array with one file,
     // to make it consistent we turn it into an array
     req.body.image = req.body.image && typeof req.body.image === 'string' ? [req.body.image] : req.body.image;

     // format images
     const images = req.body.image ? req.body.image.map(function(image) {
       image = JSON.parse(image);
       return image ? image.url : '';
     }) : [];

     const postUrl = `${apiUrl}/api/site/${siteId}/idea`;
     req.flash('success', { msg: req.body.ideaId ? 'Opgestuurd!' : 'Aangepast!'});
     res.redirect('/');


     rp({
         method: req.body.ideaId ? 'PUT' : 'POST',
         uri: req.body.ideaId ? `${postUrl}/${req.body.ideaId}` : postUrl,
         headers: {
             'Accept': 'application/json',
             "X-Authorization" : `Bearer ${req.session.jwt}`,
         },
         body: {
           title: req.body.title,
           description: req.body.description,
           summary: req.body.summary,
           location: req.body.location,
       //    status: req.body.status,
       //    modBreak: req.body.modBreak,
           thema: req.body.thema,
           extraData: {
             images: images
           }
         },
         json: true // Automatically parses the JSON string in the response
     })
       .then(function (response) {
          let redirect = req.body.redirect || req.header('Referer');

          //parse url to make sure we only redirect to a relative within the site, not external
          let redirectUrl = url.parse(redirect, true);
          redirect = redirect.replace(':id', response.id);
          redirect = redirect.replace(redirectUrl.protocol, '');
          redirect = redirect.replace(redirectUrl.host, '');

          req.flash('success', { msg: req.body.ideaId ? 'Opgestuurd!' : 'Aangepast!'});
          res.redirect(redirect);
       })
       .catch(function (err) {
         console.log('===> err', err);
        res.redirect(req.header('Referer')  || appUrl);
       });

    // Access req.body here
    // Send back an AJAX response with `res.send()` as you normally do with Express
  });

  const superPushAssets = self.pushAssets;
   self.pushAssets = function () {
     superPushAssets();
     self.pushAsset('stylesheet', 'filepond', { when: 'always' });
     self.pushAsset('stylesheet', 'trix', { when: 'always' });
     self.pushAsset('stylesheet', 'form', { when: 'always' });
     self.pushAsset('stylesheet', 'main', { when: 'always' });
     self.pushAsset('script', 'filepond', { when: 'always' });
     self.pushAsset('script', 'openstad-map', { when: 'always' });
     self.pushAsset('script', 'editor', { when: 'always' });
     self.pushAsset('script', 'trix', { when: 'always' });
     self.pushAsset('script', 'main', { when: 'always' });
   };
  }
};
