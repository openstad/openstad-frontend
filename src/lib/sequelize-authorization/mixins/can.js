const hasRole = require('../lib/hasRole');

module.exports = function can(action, user, self) {

  self = self || this;

  if (!user) user = self.auth && self.auth.user;
  if (!user || !user.role) user = { role: 'all' };

  // use function defined on model
  let functionName = 'can' + action[0].toUpperCase() + action.slice(1);
  if (self.auth && typeof self.auth[functionName] == 'function') return self.auth[functionName](user, self);

  // or fallback to default
  switch (action) {

    case 'list':
      return hasRole(user, self.auth && self.auth.listableBy, self.userId);
      break;

    case 'create':
      return hasRole(user, self.auth && self.auth.createableBy, self.userId);
      break;

    case 'view':
      return hasRole(user, self.auth && self.auth.viewableBy, self.userId);
      break;

    case 'update':
      return hasRole(user, self.auth && self.auth.updateableBy, self.userId);
      break;

    case 'delete':
      return hasRole(user, self.auth && self.auth.deleteableBy, self.userId);
      break;

    default:
      return false;
  }

}
