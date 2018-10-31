module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Main Image',
  addFields: [
    {
      name: 'title',
      type: 'string',
      label: 'Title ',
    },
    {
      name: 'image',
      type: 'attachment',
      label: 'Image ',
    },
  ]
};
