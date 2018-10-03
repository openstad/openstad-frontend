var rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Ideas',
  addFields: [
    {
      name: 'siteId',
      type: 'string',
      label: 'Site ID',
      required: true
    }
  ],
};
