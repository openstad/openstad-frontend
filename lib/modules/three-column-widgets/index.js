module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Three Column Layout',
  contextualOnly: true,
  addFields: [
    {
      name: 'areaLeft',
      type: 'area',
      label: 'Left Area',
    },
    {
      name: 'areaMiddle',
      type: 'area',
      label: 'Middle Area',
    },
    {
      name: 'areaRight',
      type: 'area',
      label: 'Right Area',
    }
  ]
};
