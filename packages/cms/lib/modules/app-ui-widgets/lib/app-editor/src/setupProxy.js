/**
 * These proxy's are set up for dev to prevent issues
 * @type {[type]}
 */

const createProxyMiddleware = require('http-proxy-middleware');
console.log('register proxy for dev')

module.exports = function(app) {
  app.use(
    '/image',
    createProxyMiddleware({
      target: 'https://image-server2.openstadsdeel.nl',
  //    target: 'http://localhost:3333',
      changeOrigin: true,
      onProxyReq : (proxyReq, req, res) => {

         // add custom header to request
         proxyReq.setHeader('Authorization', `Bearer VkajDDVm0KnDaajsjA23AdS`);
      }
    })
  );

  app.use(
    '/images',
    createProxyMiddleware({
      target: 'http://localhost:3333',
      changeOrigin: true,
      onProxyReq : (proxyReq, req, res) => {

         // add custom header to request
         proxyReq.setHeader('Authorization', `Bearer VkajDDVm0KnDaajsjA23AdS`);
      }
    })
  );

  app.use(
    '/file',
    createProxyMiddleware({
      target: 'http://localhost:3333',
      changeOrigin: true,
      onProxyReq : (proxyReq, req, res) => {

         // add custom header to request
         proxyReq.setHeader('Authorization', `Bearer VkajDDVm0KnDaajsjA23AdS`);
      }
    })
  );

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8111/api/site/148',
      changeOrigin: true,
      onProxyReq : (proxyReq, req, res) => {
         // add custom header to request
         proxyReq.setHeader('Authorization', `Bearer VkajDDVm0KnDaajsjA23AdS`);
      }
    })
  )
};
