/**
 * Api proxy allows for directly calling the API with ajax
 */
const proxy = require('http-proxy-middleware');
const apiUrl = process.env.API;
const videoApiUrl = process.env.VIDEO_API_URL ? process.env.VIDEO_API_URL : '/video';
const eventEmitter  = require('../../../events').emitter;
const querystring = require('query-string');

module.exports = {
  construct: function(self, options) {

    const apiPath = options.sitePrefix ? options.sitePrefix + '/api' : '/api'

   /*
    * Create api route for proxying api so we don't have cross origin errors when making AJAX requests
    */
   self.apos.app.use('/api', proxy({
     target: apiUrl,
     changeOrigin: true,
     pathRewrite: {['^'+apiPath] : '/api'},
     onProxyReq : (proxyReq, req, res) => {

       /**
        * Validate the request with captcha if send by a form
        */
       if (req.body && req.body.areYouABot) {
         const captchData = req.session.captcha;
         const isCaptchaValid = captchData && captchData.text && captchData.text === req.body.areYouABot;

         if (!isCaptchaValid) {
           return res.status(403).json({
             'message': 'Captcha is not correct'
           });
         }

         // clean up key before we send it to the api
         delete req.body.areYouABot;
       }

        // add custom header to request
        proxyReq.setHeader('Accept', 'application/json');
        proxyReq.setHeader('Content-Type', 'application/json; charset=utf-8');

        console.log('req.session.jwt', req.session.jwt);

        if (req.session.jwt) {
          proxyReq.setHeader('X-Authorization', `Bearer ${req.session.jwt}`);
        }

        //bodyParser middleware parses the body into an object
        //for proxying to worl we need to turn it back into a string
        if (req.method == "POST" || req.method == "PUT" || req.method == "DELETE") {
          eventEmitter.emit('apiPost');
        }

        // empty openstadUser, this doesn't logout user
        // but clears it's session cache so it will be fetched freshly
        // this is necessary in case of voting or logging out
        if (req.session.openstadUser) {
          req.session.openstadUser = null;
        }


        if ( (req.method == "POST" ||req.method == "PUT")  && req.body ) {
           // emit event
           let body = req.body;
           let newBody = '';
           delete req.body;

           // turn body object  back into a string
           //let newBody = qs.stringify(body, { skipNulls: true })
           try {
             newBody = JSON.stringify(body);
             proxyReq.setHeader( 'content-length', Buffer.byteLength(newBody, 'utf8'));
             proxyReq.write( newBody );
             proxyReq.end();
           } catch (e) {
             console.log('stringify err', e)
           }
         }

     },
     onError: function(err) {
       console.log('errerrerr newBody', err);
     }
   }));

   const statsUrl = options.sitePrefix ? options.sitePrefix + '/stats' : '/stats'

    /*
    * Create api route for proxying api so we don't have cross origin errors when making AJAX requests
    */
   self.apos.app.use('/stats', proxy({
     target: apiUrl,
     changeOrigin: true,
     pathRewrite: {['^'+statsUrl] : '/stats'},
     onProxyReq : (proxyReq, req, res) => {

        // add custom header to request
        proxyReq.setHeader('Accept', 'application/json');

        if (req.session.jwt) {
          proxyReq.setHeader('X-Authorization', `Bearer ${req.session.jwt}`);
        }

     },
     onError: function(err) {
       //console.log('errerrerr newBody', err);
     }
   }));


      const oauthUrl = options.sitePrefix ? options.sitePrefix + '/api-oauth' : '/api-oauth'


      /*
      * Create api route for proxying api so we don't have cross origin errors when making AJAX requests
      */
      self.apos.app.use('/api-oauth', proxy({
          target: apiUrl,
          changeOrigin: true,
          pathRewrite: {['^'+oauthUrl] : '/oauth'},
          onProxyReq : (proxyReq, req, res) => {
              // add custom header to request
              proxyReq.setHeader('Accept', 'application/json');

              if (req.session.jwt) {
                  //proxyReq.setHeader('X-Authorization', `Bearer ${req.session.jwt}`);
              }
          },
          onError: function(err) {
              //console.log('errerrerr newBody', err);
          }
      }));

      const videoApi = options.sitePrefix ? options.sitePrefix + '/video-api' : '/video-api'

      /*
     * Create api route for proxying api so we don't have cross origin errors when making AJAX requests
     */
      self.apos.app.use('/video-api', proxy({
          target: videoApiUrl,
          changeOrigin: true,
          pathRewrite: {['^' + videoApi]: ''},
          onProxyReq: (proxyReq, req, res) => {
              // add custom header to request
              proxyReq.setHeader("X-Auth-Key", process.env.VIDEO_API_KEY);
              proxyReq.setHeader("X-Auth-Email",process.env.VIDEO_API_EMAIL);
          },
          onError: function (err) {
              //console.log('errerrerr newBody', err);
          }
      }));

    self.apos.app.use('/api-eda', proxy({
      target: 'https://api.edamam.com/api/food-database/v2/parser',
      changeOrigin: true,
     /* pathRewrite: {
        '^/api-eda':'' //remove /service/api
      },*/
      pathRewrite: (path, req) => {
        let newPath = path.replace('api-eda', '');

        // Strip query parameter _csrf
        if (req.method === 'GET') {
          const newQuery = { ...req.query }; // copy object

          newQuery.app_id = process.env.EDA_API_ID ? process.env.EDA_API_ID : newQuery.app_id;
          newQuery.app_key = process.env.EDA_API_KEY ? process.env.EDA_API_KEY : newQuery.app_key;
          newQuery.app_test = 'making-sure';


          if (Object.keys(newQuery).length) {
            // There were more query parameters than just _csrf
            newPath = `${newPath.split('?')[0]}?${querystring.stringify(newQuery)}`;
          } else {
            // _csrf was the only query parameter
            newPath = `${newPath.split('?')[0]}`;
          }
        }

        console.log('newPath returned', newPath);

        return newPath;
      },
      onError: function(err) {
        console.log('errerrerr newBody', err);
      }

    }));



  }
};
