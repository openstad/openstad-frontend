const assert = require('assert');
const _ = require('@sailshq/lodash');

const counterWidget = require('../lib/modules/counter-widgets/index');

describe('Counter widgets', function() {

  let apos;

  this.timeout(20000);

  after(function(done) {
    require('apostrophe/test-lib/util').destroy(apos, done);
  });

  /// ///
  // EXISTENCE
  /// ///

  let counterWidgets;

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
        'apostrophe-widgets': {label: 'apostrophe-widgets'},
        'openstad-widgets': {extend: 'apostrophe-widgets'},
        'counter-widgets': counterWidget,
      },

      afterInit: function (callback) {

        counterWidgets = apos.modules['counter-widgets'];

        assert(counterWidgets.__meta.name === 'counter-widgets');

        return callback(null);
      },
      afterListen: function (err) {
        assert(!err);
        done();
      }
    });
  });

  it('Should use static count', function(done) {

    const widget = {
      counterType: 'staticCount',
      staticCount: 3
    };

    const expected = '003';

    const actual = counterWidgets.getCount(widget);

    assert(actual === expected);

    done()

  });

  it('Should use ideas count', function(done) {

    const widget = {
      counterType: 'ideasCount',
      ideasCount: 20,
    };

    const expected = '020';

    const actual = counterWidgets.getCount(widget);

    assert(actual === expected);

    done()

  });


});
