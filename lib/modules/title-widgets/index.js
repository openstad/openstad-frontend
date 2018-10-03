module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Title',
  addFields: [
    {
      name: 'title',
      type: 'string',
      label: 'Title ',
    },
    {
      name: 'mode',
      type: 'select',
      label: 'Select appearance modus for title',
      choices: [
        {
          label: 'On Campus',
          value: 'on-campus',
        },
        {
          label: 'Off Campus',
          value: 'off-campus'
        }
      ]
    },
  ]
};
