module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Card',
  addFields: [
    {
      name: 'cardTitle',
      type: 'string',
      label: 'Title',
      required: true
    },
    {
      name: 'cardDescription',
      type: 'text',
      label: 'Description',
      type: 'string',
      textarea: true
    },


    {
      name: 'cardImage',
      type: 'attachment',
      label: 'Image',
      required: true
    },


    {
      name: 'cardLink',
      type: 'string',
      label: 'Link tekst',
      required: false
    },

  ]
};
