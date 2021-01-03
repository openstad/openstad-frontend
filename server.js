require('dotenv').config();
const config = require('config');

// Env variable used by npm's `debug` package.
process.env.DEBUG = config.logging;

// Order is relevant.
require('./config/promises');
require('./config/moment');
require('./config/debug');

// Start HTTP server.
const Server     = require('./src/Server');
const Cron       = require('./src/Cron');
// const ImageOptim = require('./src/ImageOptim');

Cron.start();

Server.init();
Server.start(config.get('express.port'));
// ImageOptim.start();
