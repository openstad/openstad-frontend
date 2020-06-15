var assert = require('assert');
var _ = require('@sailshq/lodash');
var Promise = require('bluebird');

describe('Card widgets', function() {

  var apos;

  this.timeout(20000);

  after(function(done) {
    require('apostrophe/test-lib/util').destroy(apos, done);
  });

  /// ///
  // EXISTENCE
  /// ///

  it('should be a property of the apos object', function(done) {
    apos = require('apostrophe')({
      testModule: true,
      modules: {
        'apostrophe-express': {
          port: 4242,
          session: {
            secret: 'test-the-card-widgets'
          }
        },
        'card-widgets': {},
      },

      afterInit: function (callback) {

        const cardWidgets = apos.modules['card-widgets'];

        assert(cardWidgets.__meta.name === 'card-widgets');

        return callback(null);
      },
      afterListen: function (err) {
        assert(!err);
        done();
      }
    });
  });


});
