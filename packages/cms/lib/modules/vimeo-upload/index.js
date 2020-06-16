/**
 * Module for  authenticating and uploading video's to Vimeo
 */
const _ = require('lodash');
const Vimeo   = require('vimeo').Vimeo;
const multer = require('multer');

//make sure you set up a cron or npm package to delete the tmp files, multer and node dont do this Automatically
const tmpFileDir = process.env.TMP_UPLOAD_DIR ? process.env.TMP_UPLOAD_DIR : './tmp';

var fileUpload = multer({
  dest: tmpFileDir,
  limits: {
    fieldSize: 120 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    //'MP4', 'MOV', 'WMV', 'AVI', 'FLV'
    const allowedTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-ms-wmv',
      'video/avi',
      'video/x-flv',
      'video/3gpp'
    ];

   if (allowedTypes.indexOf(file.mimetype) === -1) {
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));
   }

   cb(null, true);
 }
}).single('file_data');


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
               view: req.data.global.vimeoViewSettings ? req.data.global.vimeoViewSettings : 'unlisted',
               embed:req.data.global.vimeoEmbedSettings ? req.data.global.vimeoEmbedSettings : 'public',
             }
           },
           function (uri) {
             // sadly the client only returns a relative url.
             // split it into ID and add vimeo url
             var pathArray = uri.split( '/' ); //Split the path part of the URL on /

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
