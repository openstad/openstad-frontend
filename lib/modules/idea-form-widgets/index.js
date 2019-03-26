const rp = require('request-promise');
const proxy = require('http-proxy-middleware');
const imageApiUrl = process.env.IMAGE_API_URL;
const imageApiToken = process.env.IMAGE_API_TOKEN;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Idea form',
  addFields: [
    {
      name: 'siteId',
      type: 'string',
      label: 'Site ID',
      required: true
    }
  ],
 construct: function(self, options) {
   const superPushAssets = self.pushAssets;
   const superLoad = self.load;

   self.load = (req, widgets, callback) => {
     return superLoad(req, widgets, callback);
   }

   self.apos.app.use('/image', proxy({
     target: imageApiUrl,
     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {
        // add custom header to request
        proxyReq.setHeader('Authorization', `Bearer ${imageApiToken}`);
     }
   }));

   self.apos.app.use('/images', proxy({
     target: imageApiUrl,
     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {
        // add custom header to request
        proxyReq.setHeader('Authorization', `Bearer ${imageApiToken}`);
     }
   }));


   self.route('post', 'submit', function(req, res) {

     const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
     const appUrl = self.apos.settings.getOption(req, 'appUrl');



     const siteId = req.data.global.siteId;
     const images = req.body.image ? req.body.image.map(function(image) {
       image = JSON.parse(image);
       return image ? image.url : '';
     }) : [];


     //image upload
     const body = {
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
     };

//     console.log('options', options);

     rp({
        method: 'POST',
         uri:  apiUrl + `/api/site/${siteId}/idea`,
         headers: {
             'Accept': 'application/json',
             "X-Authorization" : ` Bearer ${req.session.jwt}`,
         },
         body: body,
         json: true // Automatically parses the JSON string in the response
     })
       .then(function (response) {
         console.log('===> response', response);
          const redirectTo = req.header('Referer')  || appUrl
          res.redirect(redirectTo + '/#arg'+response.id);
       })
       .catch(function (err) {
         console.log('===> err', err);

          res.redirect(req.header('Referer')  || appUrl);
       });

    // Access req.body here
    // Send back an AJAX response with `res.send()` as you normally do with Express
  });


   self.pushAssets = function () {
     superPushAssets();
     self.pushAsset('stylesheet', 'filepond', { when: 'always' });

     self.pushAsset('stylesheet', 'trix', { when: 'always' });
     self.pushAsset('stylesheet', 'form', { when: 'always' });
     self.pushAsset('stylesheet', 'main', { when: 'always' });

     self.pushAsset('script', 'filepond', { when: 'always' });
     self.pushAsset('script', 'editor', { when: 'always' });
     self.pushAsset('script', 'trix', { when: 'always' });
     self.pushAsset('script', 'main', { when: 'always' });
   };
  }
};
