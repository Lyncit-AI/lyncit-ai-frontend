const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://3.89.218.76:8006',
      changeOrigin: true,
    })
  );
};