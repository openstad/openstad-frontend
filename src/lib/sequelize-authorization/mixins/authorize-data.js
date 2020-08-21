const hasRole = require('../lib/hasRole');

module.exports = function authorizeData(data, action, user, self, site) {

  self = self || this;
  site = site || self.site;

  try {

    if (!self.rawAttributes) throw 'empty';
    if (!user) user = self.auth && self.auth.user;
    if (!user || !user.role) user = { role: 'all' };


    // TODO: dit is een check op jezelf, nu kan de argument:view check uit de routes
    if (!self.can(action, user))  throw 'cannot';

    let keys = Object.keys( data );

    let result = {};
    keys.forEach((key) => {

      let testRole;
      if (self.rawAttributes[key] && self.rawAttributes[key].auth) {
        if (self.rawAttributes[key].auth.authorizeData) {
          data[key] = self.rawAttributes[key].auth.authorizeData(data[key], action, user, self, site);
        } else {
          testRole = self.rawAttributes[key].auth[action+'ableBy'];
        }
      }

      testRole = testRole || (self.auth && self.auth[action+'ableBy']);

      if (!hasRole(user, testRole, self.userId)) {
        data[key] = undefined;
      }

    });

  } catch (err) {
    console.log('err', err)
    emptyResult();
  } finally {
    return self;
  }

  function emptyResult() {
    Object.keys( data ).forEach((key) => {
      data[key] = undefined;
    });
  }
}
