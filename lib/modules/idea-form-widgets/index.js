const rp = require('request-promise');
const proxy = require('http-proxy-middleware');


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
     target: 'http://localhost:3333/',
     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {
        // add custom header to request
        console.log('add headers');
        const token = '27834y23874';
        proxyReq.setHeader('Authorization', `Bearer ${token}`);
     }
   }));

   self.apos.app.use('/images', proxy({
     target: 'http://localhost:3333/',
     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {
        // add custom header to request
        console.log('add headers');
        const token = '27834y23874';
        proxyReq.setHeader('Authorization', `Bearer ${token}`);
     }
   }));




   self.route('post', 'submit', function(req, res) {
     console.log('===> req.body', req.body);

     const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
     const appUrl = self.apos.settings.getOption(req, 'appUrl');
     const siteId = req.data.global.siteId;

     //image upload
     const body = {
       title: req.body.title,
       description: req.body.description,
       summary: req.body.summary,
       location: req.body.location,
   //    status: req.body.status,
   //    modBreak: req.body.modBreak,
       thema: req.body.thema
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
          const redirectTo = req.header('Referer')  || appUrl
          res.redirect(redirectTo + '/#arg'+response.id);
       })
       .catch(function (err) {
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
