const sanitize = require('sanitize-html');
const dateFormat  = require('./dateFormat');
const sanitizeConfig =  require('./sanitizeConfig');
const addHttp =  require('./addHttp');
const slugify =  require('./slugify');

module.exports = {
  construct: function(self, options) {
    self.apos.templates.addFilter('sanitize', function (s) {
      return s ? sanitize(s, sanitizeConfig) : '';
    });

    self.apos.templates.addFilter('ensureHttp', function (s) {
      return s ? addHttp(s) : '';
    });


    self.apos.templates.addFilter('date', function (s, format) {
      return s ? dateFormat.format(s, format) : '';
    });

    self.apos.templates.addFilter('repeat', function (s, format) {
      var r = '';
      while (n--) {
        r += s;
      }
      return r;
    });

    self.apos.templates.addFilter('slugify', function(s) {
        return s ? slugify(s) : '';
    });
  }
};
