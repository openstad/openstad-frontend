module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link to Anywhere',
  addFields: [
    {
      name: 'url',
      type: 'url',
      label: 'URL',
      required: true
    },
    {
      name: 'label',
      type: 'string',
      label: 'Label',
      required: true
    }
  ]
};
