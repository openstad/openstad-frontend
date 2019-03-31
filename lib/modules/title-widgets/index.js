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
          label: 'Heading 1',
          value: 'h1',
        },
        {
          label: 'Heading 2',
          value: 'h2',
        },
        {
          label: 'Heading 3',
          value: 'h3',
        },
        {
          label: 'Heading 4',
          value: 'h4',
        },
      ]
    },
    {
      name: 'margin',
      type: 'string',
      label: 'Margin',
    },
  ]
};
