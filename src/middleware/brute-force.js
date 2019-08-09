const ExpressBrute = require('express-brute');
const createError = require('http-errors')
const moment = require('moment-timezone');

const failCallback = function (req, res, next, nextValidRequestDate) {
  next(createError(429, "Te veel verzoeken, probeer het weer " + moment(nextValidRequestDate).fromNow()));
};

const handleStoreError = function (error) {
    log.error(error); // log this error so we can figure out what went wrong
    // cause node to exit, hopefully restarting the process fixes the problem
    throw {
        message: error.message,
        parent: error.parent
    };
}

//CONFIGURE BRUTE FORCE PROTECT
exports.post = new ExpressBrute(new ExpressBrute.MemoryStore(), {
	freeRetries: 5,
	minWait: 30*1000, // 30 seconds
	maxWait: 60*60*1000, // 1 hour,
	failCallback: failCallback,
	handleStoreError: handleStoreError
});

//CONFIGURE BRUTE FORCE PROTECT
exports.global = new ExpressBrute(new ExpressBrute.MemoryStore(), {
	freeRetries: 1000,
	attachResetToRequest: false,
	refreshTimeoutOnRequest: false,
	minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
	maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
	lifetime: 24*60*60, // 1 day (seconds not milliseconds)
	failCallback: failCallback,
	handleStoreError: handleStoreError
});
