var _            = require('lodash')
  , config       = require('config')
  , express      = require('express');

// Misc
var util         = require('./util');
var log          = require('debug')('app:http');
const morgan     = require('morgan')

var reportErrors = config.sentry && config.sentry.active;

module.exports  = {
	app: undefined,

	init: async function() {
      log('initializing...');

      // var Raven       = require('../config/raven');
      var compression = require('compression');
      // var cors        = require('cors');

      this.app = express();
      this.app.disable('x-powered-by');
      this.app.set('trust proxy', true);
      this.app.set('view engine', 'njk');
      this.app.set('env', process.env.NODE_APP_INSTANCE || 'development');

      if (process.env.REQUEST_LOGGING === 'ON') {
        this.app.use(morgan('dev'));
      }

      if( reportErrors ) {
          // this.app.use(Raven.requestHandler());
      }
      this.app.use(compression());

  //  this
      // this.app.use(cors());

      // Register statics first...
      this._initStatics();

      // ... then middleware everyone needs...
      this._initBasicMiddleware();
      this._initSessionMiddleware();

      var middleware = config.express.middleware;

      middleware.forEach(( entry ) => {
          if (typeof entry == 'object' ) {
              // nieuwe versie: use route
              this.app.use(entry.route, require(entry.router));
          } else {
              // oude versie: de file doet de app.use
              require(entry)(this.app);
          }
      });

      if( reportErrors ) {
          // this.app.use(Raven.errorHandler());
      }

      require('./middleware/error_handling')(this.app);
	},

	start: function( port ) {
		this.app.listen(port, function() {
		  log('listening on port %s', port);
		});
	},

	_initStatics: function() {


		var headerOptions = {
			setHeaders: function( res ) {
				res.set({
					'Cache-Control': 'private'
				});
			}
		};

    this.app.use(express.static('public'));

	//	this.app.use('/js',  express.static('js', headerOptions));
	},
	_initBasicMiddleware: function() {
		var bodyParser         = require('body-parser');
		var cookieParser       = require('cookie-parser');
		var methodOverride     = require('method-override');

		// Middleware to fill `req.site` with a `Site` instance.
		const sessionSite = require('./middleware/site');
		this.app.use(sessionSite);

		this.app.use(require('./middleware/security-headers'));

		this.app.use(bodyParser.json({limit: '10mb'}));
		this.app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
		this.app.use(cookieParser(config.get('security.sessions.secret')));
		this.app.use(methodOverride(function( req, res ) {
			var method;
			if( req.body && req.body instanceof Object && '_method' in req.body ) {
				method = req.body._method;
				delete req.body._method;
			} else {
				method = req.get('X-HTTP-Method') ||
				         req.get('X-HTTP-Method-Override') ||
				         req.get('X-Method-Override');
			}
			if( method ) {
				log('method override: '+method);
			}
			return method;
		}));
	},
	_initSessionMiddleware: function() {
		// Session management
		// ------------------
		var session        = require('express-session');
		var SequelizeStore = require('connect-session-sequelize')(session.Store);
		var db             = require('./db');
		this.app.use(session({
			name              : config.get('security.sessions.cookieName') || 'amsterdam.sid',
			secret            : config.get('security.sessions.secret'),
			proxy             : true, // Trust apache reverse proxy
			resave            : false,
			unset             : 'destroy',
			saveUninitialized : false,
			store: new SequelizeStore({
				db    : db.sequelize,
				table : 'session'
			}),
			cookie: {
				httpOnly : true,
				secure   : config.get('security.sessions.onlySecure'),
				sameSite : false,//config.get('security.sessions.onlySecure'),
				maxAge   : config.get('security.sessions.maxAge')
			}
		}));

		// Middleware to fill `req.user` with a `User` instance.
		const getUser = require('./middleware/user');
		this.app.use(getUser);

	},
};
