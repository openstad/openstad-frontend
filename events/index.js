const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
const clearCache = require('../services/cache').clearCache;


myEmitter.on('apiPost', clearCache);
myEmitter.on('voted', clearCache);
myEmitter.on('ideaCrud', clearCache);
myEmitter.on('postArgument', clearCache);

exports.emitter = myEmitter;
