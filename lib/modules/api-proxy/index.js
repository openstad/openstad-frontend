const proxy = require('http-proxy-middleware');
const apiUrl = process.env.API;
const eventEmitter  = require('../../../events').emitter;

module.exports = {
  construct: function(self, options) {
   /*
    * Create api route for proxying api so we don't have cross origin errors when making AJAX requests
    */
   self.apos.app.use('/api', proxy({
     target: apiUrl,
     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {

        // add custom header to request
        proxyReq.setHeader('Accept', 'application/json');

        if (req.session.jwt) {
          proxyReq.setHeader('X-Authorization', `Bearer ${req.session.jwt}`);
        }

        //bodyParser middleware parses the body into an object
        //for proxying to worl we need to turn it back into a string
        if ( req.method == "POST" && req.body ) {
           // emit event
           eventEmitter.emit('apiPost');

           let body = req.body;
           delete req.body;

           // turn body object  back into a string
           let newBody = Object.keys( body ).map(function( key ) {
               return encodeURIComponent( key ) + '=' + encodeURIComponent( body[ key ])
           }).join('&');

           // Update header
           proxyReq.setHeader( 'content-type', 'application/x-www-form-urlencoded' );
           proxyReq.setHeader( 'content-length', newBody.length );
           proxyReq.write( newBody );
           proxyReq.end();
         }
     },
     onError: function(err) {
       console.log('Api-proxy error', err);
     }
   }));
  }
};
