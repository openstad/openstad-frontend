/**
 * Manage a hash for guests so they can submit multiple forms without being authenticated
 */
const generateToken = require('../utils/generate-token');
const hashKey = '';

const generateHash = (session) => {
  return generateToken({length: 256});
}

exports.getHash = async (req) => {
  let hash = req.session && req.session[hashKey] ? req.session[hashKey] : false;

  if (!hash) {
    hash = generateHash();
    req.session[hashKey] = hash;
  }


  await req.session.save();
  return hash;
}
