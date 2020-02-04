const stripTags = require('./stripTags');
const dateFormat  = require('./dateFormat');

const allowedTags = ['<br />', '<a>', '<p>', '<b>', '<br>', '<em>', '<h1>', '<h2>', '<h3>', '<i>', '<strong>'];


module.exports = {
  construct: function(self, options) {
    self.apos.templates.addFilter('stripSafe', function (s) {
      return s ? stripTags(s, allowedTags.join('')) : '';
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
  }
};
