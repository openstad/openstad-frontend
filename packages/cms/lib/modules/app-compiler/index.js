const proxy = require('./lib/compiler');

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
