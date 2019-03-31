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

/**
 *
 *
 *
@TODO arrangeFields
 // Separate the palette field names so we can group them in a tab
var fieldNames = _.map(options.paletteFields, function (field) {
  return field.name
});

options.arrangeFields = (options.arrangeFields || []).concat([
  {
    name: 'palette',
    label: 'Palette Fields',
    fields: fieldNames.concat(['paletteCounter'])
  }
]);
 *
 */
