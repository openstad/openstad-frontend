const proxy = require('http-proxy-middleware');
const apiUrl = process.env.API;
const eventEmitter  = require('../../../events').emitter;

module.exports = {
  construct: function(self, options) {
   /*
    * Create api route for proxying api
    */

   self.apos.app.use('/api', proxy({
     target: apiUrl,
     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {
        // add custom header to request

      //  proxyReq.body = req.body;
        proxyReq.setHeader('Accept', 'application/json');

        if (req.session.jwt) {
          proxyReq.setHeader('X-Authorization', `Bearer ${req.session.jwt}`);
        }


        //bodyParser middleware messes up the body for proxying
        //
        if ( req.method == "POST" && req.body ) {
             // emit event
             eventEmitter.emit('apiPost');

             let body = req.body;
             delete req.body;

             // URI encode JSON object
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
       console.log('errerrerr newBody', err);
     }
   }));
  }
};
