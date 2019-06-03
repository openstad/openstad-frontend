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
              'label': 'Margin top',
              'value': 'margin-top'
            },
            {
              'label': 'Margin bottom',
              'value': 'margin-bottom'
            },
            {
              'label': 'Margin left',
              'value': 'margin-left'
            },
            {
              'label': 'Margin right',
              'value': 'margin-right'
            },
            {
              'label': 'Padding',
              'value': 'padding'
            },
            {
              'label': 'Padding top',
              'value': 'padding-top'
            },
            {
              'label': 'Padding bottom',
              'value': 'padding-bottom'
            },
            {
              'label': 'Padding left',
              'value': 'padding-left'
            },
            {
              'label': 'Padding right',
              'value': 'padding-right'
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
            {
              'label': 'Text align',
              'value': 'text-align'
            },
            {
              'label': 'Float',
              'value': 'float'
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
