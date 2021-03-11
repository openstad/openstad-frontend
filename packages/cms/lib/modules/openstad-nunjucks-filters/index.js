const sanitize        = require('sanitize-html');
const dateFormat      = require('./dateFormat');
const sanitizeConfig  =  require('./sanitizeConfig');
const addHttp         =  require('./addHttp');
const slugify         =  require('./slugify');
const currency        =  require('./currency');

module.exports = {
  construct: function(self, options) {
    self.apos.templates.addFilter('sanitize', function (s) {
      return s ? sanitize(s, sanitizeConfig) : '';
    });

    self.apos.templates.addFilter('ensureHttp', function (s) {
      return s ? addHttp(s) : '';
    });

    self.apos.templates.addFilter('currency', function (s) {
      return s ? currency(s) : '';
    });

    self.apos.templates.addFilter('safeRelativeUrl', function (s) {
      // in case of starting with an / it expects to be relative so we add the siteUrl
      // this way /page also works for subdirectory sites
      // for example domain.com/site1 has a link to /page1, this wil turn that into  domain.com/site1/page1
      const siteUrl = options.siteUrl;
      return s.startsWith('/') ? siteUrl +  s : s;
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
