module.exports = {
  addFields: [
    {
      type: 'string',
      name: 'siteTitle',
      label: 'Site title'
    },
    {
      type: 'string',
      name: 'siteId',
      label: 'Site ID (!important for api calls)'
    },
    {
      name: 'ideaSlug',
      type: 'string',
      label: 'Slug van idee pagina',
      required: true
    },
    {
      type: 'string',
      name: 'analytics',
      label: 'Google Analytics Property ID (like UA-xxxxx)'
    },
    {
      name: 'siteLogo',
      type: 'attachment',
      svgImages: true,
      label: 'Image',
      trash: true
    },
  ]
};
