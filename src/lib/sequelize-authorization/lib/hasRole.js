// roles definition; should be configurable once that is used in the rest of the applications

let roles = {
  admin: ['admin', 'moderator', 'editor', 'member', 'anonymous', 'all'],
  moderator: ['moderator', 'editor', 'member', 'anonymous', 'all'],
  editor: ['editor', 'member', 'anonymous', 'all'],
  member: ['member', 'anonymous', 'all'],
  anonymous: ['anonymous', 'all'],
  all: ['all'],   // special
  owner: null, // special
}

module.exports = function hasRole(user, minRoles, ownerId) {

  minRoles = minRoles || 'admin'; // admin can do anything
  if (!Array.isArray(minRoles)) minRoles = [minRoles];

  // todo: owner
  let userRole = user && user.role;

  let valid = minRoles.find( minRole => {
    let x = roles[userRole] && roles[userRole].indexOf(minRole) != -1
    return x;
  });

  if ( minRoles.includes('owner') && ownerId ) {
    valid = valid || ( user.id == ownerId );
  }

  return valid
}
