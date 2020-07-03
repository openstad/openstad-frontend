const fs = require('fs');
const multer            = require('multer');
const upload            = multer();

module.exports = {
  extend:    'apostrophe-widgets',
  label:     'Attachments upload',
  construct: function (self, options) {

    self.apos.app.post(
      '/attachment-upload',
      upload.array('files'),
      (req, res, next) => {

        // check user - this module is used by the admin server which has the same SITE_API_KEY
        // TODO: this should be done through generic middleware that does a more sensible check
        let authHeader = req.headers['x-authorization'];
        if (!authHeader || authHeader != process.env.SITE_API_KEY) return next('Iznogood');

        // collect files
        let promises = [];
        req.files.forEach((file, i) => {
          let path = 'public/uploads/attachments/' + file.originalname;
          promises.push(
            new Promise( (resolve,reject) => {
              // existing files are ignored; it  is more then likely the same file
              fs.access(path, fs.constants.F_OK, (err) => {
                if (!err) {
                  // console.log('File exists', file.originalname);
                  return resolve()
                };
                console.log('Create file', file.originalname);
                fs.writeFile(path, file.buffer, err => {
                  err ? reject() : resolve()
                });
              });
            })
          )
        });

        // do save
        Promise
          .all(promises)
          .then(result => {
            res.json({res: 'ok'})
          })
          .catch(next)
        
      });
  }
}
