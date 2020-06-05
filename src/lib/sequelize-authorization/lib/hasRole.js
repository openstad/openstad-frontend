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
    // console.log('-',roles[userRole]);
    // console.log('-',minRole);
    // console.log('-',roles[userRole].indexOf(minRole));
    let x = roles[userRole] && roles[userRole].indexOf(minRole) != -1
    return x;
  });
  // console.log('HASROLE 1', valid, minRoles, userRole);
  if ( minRoles.includes('owner') && ownerId ) {
    // console.log('owner', user.id, ownerId);
    valid = valid || ( user.id == ownerId );
  }

  // console.log('HASROLE 2:', minRoles + '/' +userRole, ownerId, valid);
  
  return valid
}

