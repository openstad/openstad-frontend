const proxy = require('http-proxy-middleware');
const apiUrl = process.env.API;

module.exports = {
  construct: function(self, options) {
   /*
    * Create route for proxying one image to image server, add api token in header
    */
   self.apos.app.use('/api', proxy({
     target: apiUrl,
     changeOrigin: true,
     onProxyReq : (proxyReq, req, res) => {
        // add custom header to request
        proxyReq.setHeader('Accept', 'application/json');
        proxyReq.setHeader('X-Authorization', `Bearer ${req.session.jwt}`);
     }
   }));
  }
};
