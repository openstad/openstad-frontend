/**
 * Module for  authenticating and uploading video's to Vimeo
 */
const _ = require('lodash');
const Vimeo = require('vimeo').Vimeo;
const vimeoScopes = ['public'];
const moment = require('moment');


module.exports = {
  improve: 'apostrophe-global',

  beforeConstruct: function (self, options) {
  },

  construct: function(self, options) {

    // aff
    options.addFields = (options.addFields || []).concat([
      {
        name: 'vimeoClientId',
        label: 'Vimeo client id',
        type: 'string'
      },
      {
        name: 'vimeoClientSecret',
        label: 'Vimeo secret id',
        type: 'string'
      },
      {
        name: 'vimeoAcccesToken',
        //helpHtml: 'To get an access token need to login into ve<a href="/"> here </a>',
        type: 'string'
    ]);

    // Separate the palette field names so we can group them in a tab
    var fieldNames = _.map(options.paletteFields, function (field) {
      return field.name;
    });

    //vimeo wants the same token on end and beginning
    self.generateState = () => {
       return moment().utc().format('YMD')
    }

    options.arrangeFields = (options.arrangeFields || []).concat([
      {
        name: 'general',
        label: 'Vimeo',
        fields: ['vimeoClientId', 'vimeoClientSecret', 'vimeoAcccesToken']
      },
    ]);

    // This route serves the existing palette stylesheet, constructed from the global object
    // We do it this way so the browser can cache the styles as often as possible
    self.apos.app.get('generate-vimeo-token', function (req, res) {
      const client = new Vimeo(req.data.global.vimeoClientId, req.data.global.vimeoClientSecret, req.data.global.vimeoAcccesToken);

      // `scope` is an array of permissions your token needs to access. You
      // can read more at https://developer.vimeo.com/api/authentication#supported-scopes
      client.generateClientCredentials(scope, function (err, response) {
        if (err) {
          throw err;
        }

        var token = response.access_token;

        // Other useful information is included alongside the access token,
        // which you can dump out to see, or visit our API documentation.
        //
        // We include the final scopes granted to the token. This is
        // important because the user, or API, might revoke scopes during
        // the authentication process.
        var scopes = response.scope;
      });
    });


    self.apos.app.get('vimeo-api', function (req, res) {

        if (this._accessToken) {
          requestOptions.headers.Authorization = 'Bearer ' + this._accessToken
        } else if (this._clientId && this._clientSecret) {
          var basicToken = Buffer.from(this._clientId + ':' + this._clientSecret)
          requestOptions.headers.Authorization = 'Basic ' + basicToken.toString('base64')
        }

        if (['POST', 'PATCH', 'PUT', 'DELETE'].indexOf(requestOptions.method) !== -1 &&
          !requestOptions.headers['Content-Type']
        ) {
          // Set proper headers for POST, PATCH and PUT bodies.
          requestOptions.headers['Content-Type'] = 'application/json'
        } else if (requestOptions.method === 'GET') {
          // Apply parameters to the URL for GET requests.
          requestOptions.path = this._applyQuerystringParams(requestOptions, options)
        }

    });

  },

};
