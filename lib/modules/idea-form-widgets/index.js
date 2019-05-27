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



/*
   self.expressMiddleware = {
      when: 'beforeRequired',
      middleware: function(req, res, next) {
        console.log('111 csrf', req.query);

        if (!(req.query && req.query['_csrf'])) {
          return next();
        }


        console.log('SET HEADER TOKEN');

        req.headers['X-XSRF-TOKEN'] = req.query['_csrf'];

        console.log('SET HEADER TOKEN', req.headers );

        return next();
      }
    };
*/

   self.route('post', 'submit', function(req, res) {
     /**
      * Add CSRF
      */
     const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
     const appUrl = self.apos.settings.getOption(req, 'appUrl');

     const siteId = req.data.global.siteId;
     const postUrl = `${apiUrl}/api/site/${siteId}/idea`;
     const httpHeaders = {
         'Accept': 'application/json',
         "X-Authorization" : `Bearer ${req.session.jwt}`,
     };
     let redirect = req.body.redirect || req.header('Referer');

     if (req.body.action && req.body.action === 'UPDATE_STATUS') {
       rp({
           method: 'PUT',
           uri: `${postUrl}/${req.body.ideaId}`,
           headers: httpHeaders,
           body: {
             status: req.body.status
           },
           json: true // Automatically parses the JSON string in the response
       })
       .then(function (response) {
         console.log('===>>> response', response)
          //req.flash('success', { msg: 'Status aangepast!'});

          res.setHeader('Content-Type', 'application/json');


          res.end(JSON.stringify({
            id: response.id
          }));

          //res.redirect(req.header('Referer') || '/');
       })
       .catch(function (err) {
         res.status(500).json(JSON.stringify(err));

        //req.flash('error', { msg: 'Status niet aangepast!'});
         //return res.redirect(req.header('Referer') || '/');
       });
     } else if (req.body.action && req.body.action === 'DELETE') {
       rp({
           method: 'DELETE',
           uri: `${postUrl}/${req.body.ideaId}`,
           headers: httpHeaders,
           json: true // Automatically parses the JSON string in the response
       })
       .then(function (response) {
        //  req.flash('success', { msg: 'Verwijderd!'});
        //  res.redirect('/');
          res.setHeader('Content-Type', 'application/json');

          res.end(JSON.stringify({
            id: response.id
          }));
       })
       .catch(function (err) {
        // req.flash('error', { msg: 'Er ging iets mis met verwijderen'});
        // return res.redirect(req.header('Referer')  || appUrl);
        res.status(500).json(JSON.stringify(err));

       });
     } else {
       // when only one image filepondjs sadly just returns object, not array with one file,
       // to make it consistent we turn it into an array
       req.body.image = req.body.image && typeof req.body.image === 'string' ? [req.body.image] : req.body.image;

       // format images
       const images = req.body.image ? req.body.image.map(function(image) {
         image = JSON.parse(image);
         return image ? image.url : '';
       }) : [];
       rp({
           method: req.body.ideaId ? 'PUT' : 'POST',
           uri: req.body.ideaId ? `${postUrl}/${req.body.ideaId}` : postUrl,
           headers: httpHeaders,
           body: {
             title: req.body.title,
             description: req.body.description,
             summary: req.body.summary ? req.body.summary.replace(/(\r\n|\n|\r)/gm, "") : '',
             location: req.body.location,
         //    status: req.body.status,
         //    modBreak: req.body.modBreak,
             extraData: {
               images: images,
               theme: req.body.theme,
               area: req.body.area,
             }
           },
           json: true // Automatically parses the JSON string in the response
       })
       .then(function (response) {
    //     console.log('===>>> response', response)
          //parse url to make sure we only redirect to a relative within the site, not external
        /*  let redirectUrl = req.body.redirect || req.header('Referer');
          redirectUrl = url.parse(redirectUrl, true);
          redirectUrl = redirectUrl.path;
          redirectUrl = redirectUrl.replace(':id', response.id);
          redirectUrl = redirectUrl.replace(redirectUrl.protocol, '');
          redirectUrl = redirectUrl.replace(redirectUrl.host, '');
          res.redirect(redirectUrl);
*/

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            id: response.id
          }));
       })
       .catch(function (err) {
         console.log(err.error);
         res.setHeader('Content-Type', 'application/json');
         res.status(500).end(JSON.stringify({
           msg: err.error[0]
         }));
        // res.redirect(req.header('Referer')  || appUrl);
       });
     }
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
     self.pushAsset('script', 'delete-form', { when: 'always' });
     self.pushAsset('script', 'status-form', { when: 'always' });
   };
  }
};
