const hasRole = require('../lib/hasRole');

module.exports = function toAuthorizedJSON(user) {

  let self = this;

  if (!self.rawAttributes) return {};
  if (typeof user != 'object') user = undefined;
  if (!user) user = self.auth && self.auth.user;
  if (!user || !user.role) user = { role: 'all' };

  if (!self.can('view', user)) return {};

  let keys = self._options.attributes || Object.keys( self.dataValues );
  keys = keys.concat( Object.keys(self).filter( key => key != 'dataValues' && !key.match(/^_/) ) );

  let result = {};
  keys.forEach((key) => {

    let value = self.get(key);
    if (key == 'id') {
      // todo: primary keys, not id
      result[key] = value;
    } else {
      result[key] = authorizedValue(key, value, user);
    }

  });

  if ( self.auth && self.auth.toAuthorizedJSON ) {
    result = self.auth.toAuthorizedJSON(user, result, self);
  }

  return Object.keys(result).length ? result : undefined;

  function authorizedValue(key, value, user) {

    if (value && value.toJSON) {
      // TODO: for associated models this should use the association key to check the validity
      return value.toJSON(user);
    }

    if (Array.isArray(value)) {

      let aresult = [];
      aresult = value.map(val => {
        return authorizedValue(key, val, user);
      });

      return aresult.length ? aresult : undefined;
    }

    let testRole;
    if (self.rawAttributes[key] && self.rawAttributes[key].auth) {
      if (self.rawAttributes[key].auth.authorizeData) {
        return self.rawAttributes[key].auth.authorizeData(null, 'view', user, self, self.site);
      } else {
        testRole = self.rawAttributes[key].auth.viewableBy;
      }
    }
    testRole = testRole || ( self.auth && self.auth.viewableBy );
    if ( hasRole(user, testRole, self.userId)) {
      return value;
    }

  }

}

