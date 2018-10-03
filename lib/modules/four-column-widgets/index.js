module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Four Column',
  contextualOnly: true,
  addFields: [
    {
      name: 'areaLeft',
      type: 'area',
      label: 'Left Area',
    },
    {
      name: 'areaMiddle1',
      type: 'area',
      label: 'Middle Area 1',
    },
    {
      name: 'areaMiddle2',
      type: 'area',
      label: 'Middle Area 2',
    },
    {
      name: 'areaRight',
      type: 'area',
      label: 'Right Area',
    }
  ]};
