const sanitize = require('sanitize-html');
const dateFormat  = require('./dateFormat');
const sanitizeConfig =  require('./sanitizeConfig');
const addHttp =  require('./addHttp');
const slugify =  require('./slugify');
const remoteURL = /^(?:\/\/)|(?:\w+?:\/{0,2})/;

module.exports = {
  construct: function(self, options) {
    self.apos.templates.addFilter('sanitize', function (s) {
      const siteUrl = options.siteUrl;

      // overwrite default config to add possibility to put siteUrl in front of it
      sanitizeConfig.transformTags.a = function( tagName, attrs ) {
        if( attrs.href && remoteURL.test(attrs.href) ) {
          attrs.target = '_blank';
          attrs.rel    = 'noreferrer noopener';
        } else if (attrs && attrs.href && siteUrl)  {
          attrs.href =  attrs.href && attrs.href.startsWith('/') ?  siteUrl + attrs.href : attrs.href;
        }

        return {tagName: tagName, attribs: attrs};
      };

      return s ? sanitize(s, sanitizeConfig) : '';
    });

    self.apos.templates.addFilter('ensureHttp', function (s) {
      return s ? addHttp(s) : '';
    });

    self.apos.templates.addFilter('safeRelativeUrl', function (s) {
      // in case of starting with an / it expects to be relative so we add the siteUrl
      // this way /page also works for subdirectory sites
      // for example domain.com/site1 has a link to /page1, this wil turn that into  domain.com/site1/page1
      const siteUrl = options.siteUrl;
      return s && s.startsWith('/') ? siteUrl +  s : s;
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
