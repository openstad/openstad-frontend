/**
 * Module adds captcha for spam protection
 * Now using an independent SVG captcha,
 * Need to see if this is not causing performance issues in the future
 * The validation is done by default in de api-proxy since the
 *
 * Status: just created, some usability issue with bad captcha's looking at creating a refresh option before releasing it live
 */
const svgCaptcha = require('svg-captcha');

module.exports = {
  name: 'openstad-captcha',
  construct(self, options) {

    self.expressMiddleware = {
      when: 'afterRequired',
      middleware: (req, res, next) => {
      // fetch the captcha from the session so it doesn't change every request and will be impossible to Validate
      // problem might be that a captcha is hard to decifer and the user can't refresh for a new one
      if (req.session.captcha && req.session.captcha.text) {
        req.data.captcha = req.session.captcha;
      } else {
        const captcha = svgCaptcha.create();
        req.session.captcha = captcha;
        req.data.captcha = captcha;
      }
        next();
      }
    };
  }
};
