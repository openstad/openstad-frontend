const openstadApiModule = require('../lib/modules/openstad-api/index');
const assert = require('assert');

describe('Counter widgets', function() {

  let apos;

  this.timeout(20000);

  after(function(done) {
    require('apostrophe/test-lib/util').destroy(apos, done);
  });

  /// ///
  // EXISTENCE
  /// ///

  let openstadApi;

  it('should be a property of the apos object', function(done) {
    apos = require('apostrophe')({
      testModule: true,
      shortName: 'test',
      modules: {
        'apostrophe-express': {
          port: 4242,
          session: {
            secret: 'test-theå-card-widgets'
          }
        },
        'openstad-api': openstadApiModule,
      },

      afterInit: function (callback) {

        openstadApi = apos.modules['openstad-api'];

        assert(openstadApi.__meta.name === 'openstad-api');

        return callback(null);
      },
      afterListen: function (err) {
        assert(!err);
        done();
      }
    });
  });

  it('Should get property from getObjectValue', function(done) {
    const object = {
      test: {
        key: 'value'
      }
    };

    const expected = 'value';
    const actual = openstadApi.getObjectValue(object, 'test.key');

    assert(actual === expected);

    done()

  });

  it('Should set property with value to empty object', function(done) {
    const object = {};

    const expected = 'value';

    openstadApi.setObjectValue(object, 'test.styling.logo', 'value');

    assert(object.test.styling.logo === expected);

    done()
  });

  it('Should set property with value to object', function(done) {
    const object = {
      test: {
        key: 'value'
      }
    };

    const expected = 'value';

    openstadApi.setObjectValue(object, 'test.styling.logo', 'value');

    assert(object.test.styling.logo === expected);

    done()
  });

  it('Should add new property to object', function(done) {
    const object = {
      test: {
        key: 'value'
      }
    };

    const expected = 'value';

    openstadApi.setObjectValue(object, 'styling.logo', 'value');

    assert(object.styling.logo === expected);

    done()
  });

});
