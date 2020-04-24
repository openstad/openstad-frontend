/**
 * Module for  authenticating and uploading video's to Vimeo
 */
const _ = require('lodash');
const Vimeo   = require('vimeo').Vimeo;
const multer = require('multer');
var fileUpload = multer({  dest:'./tmp/' }).single('file_data');


module.exports = {
  improve: 'apostrophe-global',

/*  addFields: [
    {
      name: 'vimeoClientId',
      label: 'Vimeo client id',
      type: 'string'
    },
    {
      name: 'vimeoClientSecret',
      label: 'Vimeo secret id',
      type: 'string'
    },
    {
      name: 'vimeoAcccesToken',
      //helpHtml: 'To get an access token need to login into ve<a href="/"> here </a>',
      type: 'string'
    }
  ]
*/
  beforeConstruct: function (self, options) {

  },

  construct: function(self, options) {

      /*
    options.addFields = (options.addFields || []).concat([

    ]);
  options.arrangeFields = (options.arrangeFields || []).concat([

    ]);*/

    /**
     * Allow vimeo uploads
     */
    self.apos.app.use('/vimeo-upload', fileUpload, (req, res, next) => {
         // add custom header to request
         //proxyReq.setHeader('Authorization', `Bearer ${imageApiToken}`);
         const _clientSecret = req.data.global.vimeoClientId;
         const _clientId = req.data.global.vimeoClientId;
         const bearerToken = req.data.global.vimeoAcccesToken;

         const vimeoClient = new Vimeo(_clientSecret, _clientId, bearerToken);

         vimeoClient.upload(
           req.file.path,
           {
             privacy: {
               view: 'anybody',
            //   embed: 'anybody'
             }
           },
           function (uri) {
             // sadly the client only returns a relative url.
             // split it into ID and add vimeo url
             console.log('File upload completed. Your Vimeo URI is:', uri)
             var pathArray = uri.split( '/' ); //Split the path part of the URL on /
             console.log('File upload completed. Your Vimeo URI is:', pathArray)

             res.json({
               vimeoUrl:'https://vimeo.com/' + pathArray[2],
               vimeoId: pathArray[2],
               vimeoEmbedUrl: 'https://player.vimeo.com/video/' + pathArray[2],
             });
           },
           function (bytesUploaded, bytesTotal) {
             var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
           },
           function (error) {
             console.log('error', error);
             res.status(500).json({
               error: error
             })
           }
         )
      });
    }
};
