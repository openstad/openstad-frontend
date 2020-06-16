module.exports = {
  extend: 'openstad-widgets',
  label: 'Custom Title',
  addFields: [
    {
      name: 'title',
      type: 'string'
    }
  ],
  construct(self, options) {
    console.log('in custom title widget');
  }
};
