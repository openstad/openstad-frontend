exports.default = {
  definition: (name, label) => {
    return {
      name: name ? name : 'styles',
      label: label ? label : 'Styles',
      type: 'array',
      titleField: 'property',
      schema: [
        {
          name: 'property',
          type: 'select',
          label: 'CSS property',
          choices: [
            {
              'label': 'Background color',
              'value': 'background-color'
            },
            {
              'label': 'Margin',
              'value': 'margin'
            },
            {
              'label': 'Padding ',
              'value': 'padding'
            },
            {
              'label': 'Font size',
              'value': 'font-size'
            },
            {
              'label': 'Font color',
              'value': 'color'
            },
            {
              'label': 'Max width',
              'value': 'max-width'
            },
          ]
        },
        {
          name: 'value',
          type: 'text',
          label: 'CSS Value',
          type: 'string',
        },
      ],
    }
  },
  format: (cssValues) => {
    let formattedStyles = '';

    if (cssValues) {
      cssValues.forEach((css) => {
        formattedStyles += `${css.property}:${css.value};`;
      });
    }

    return formattedStyles;
  }
}
