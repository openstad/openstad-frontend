/**
 * Module for  authenticating and uploading video's to Vimeo.
 * Endpoints allows for uploading a file, save it in a tmp folder, and upload it to vimeo.
 *
 * Be sure to clean up your tmp file.
 * Vimeo takes a few mintures to 15 minutes to have the video available
 * The form field in resource form sets it to extraData.vimeoId.
 * Api keys are fetched from the siteConfig (nog apos global for security reasons)
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

  beforeConstruct: function (self, options) {

  },

  construct: function(self, options) {

    /**
     * Allow vimeo uploads
     */
    self.apos.app.use('/vimeo-upload', fileUpload, (req, res, next) => {

         const siteConfig = self.apos.settings.options.siteConfig;
         const vimeoConfig = siteConfig && siteConfig.vimeo ? siteConfig.vimeo : false;

         if (!vimeoConfig) {
           res.status(500).json({
             error: 'Vimeoconfig not existing'
           });
         }

         const _clientSecret = vimeoConfig.secret;
         const _clientId = vimeoConfig.clientId;
         const bearerToken = vimeoConfig.accessToken;

         const vimeoClient = new Vimeo(_clientSecret, _clientId, bearerToken);

         vimeoClient.upload(
           req.file.path,
           {
             privacy: {
               view: vimeoConfig.vimeoViewSettings ? vimeoConfig.vimeoViewSettings : 'unlisted',
               embed: vimeoConfig.vimeoEmbedSettings ? vimeoConfig.vimeoEmbedSettings : 'public',
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
