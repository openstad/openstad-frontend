module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Section',
  addFields: [
    {
      name: 'backgroundColor',
      type: 'color',
      label: 'Background color',
      required: true
    },
    {
      name: 'areaMain',
      type: 'area',
      label: 'Main Area',
    }
  ]
};
