const proxy = require('http-proxy-middleware');
const apiUrl = process.env.API;

module.exports = {
  construct: function(self, options) {
   /*
    * Create api route for proxying api
    */
   self.apos.app.use('/api', proxy({
     target: apiUrl,
//     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {
        // add custom header to request

        console.log('aaaa', proxyReq);
        proxyReq.setHeader('Accept', 'application/json');

        if (req.session.jwt) {
          proxyReq.setHeader('X-Authorization', `Bearer ${req.session.jwt}`);
        }
     },
     onError: function(err) {
       console.log('errerrerr', err);
     }
   }));
  }
};
