const proxy = require('./lib/compiler');
const tmpFileDir = process.env.TMP_UPLOAD_DIR ? process.env.TMP_UPLOAD_DIR : './tmp';

module.exports = {
  construct: function(self, options) {

    /*
    * Create api route for proxying api so we don't have cross origin errors when making AJAX requests
    */
   self.apos.app.use('/compile', (req, res, next) = {
     const appData = req.body.app;


   });
  }
};
