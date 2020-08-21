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
              'label': 'Background position',
              'value': 'background-position'
            },
            {
              'label': 'Border color',
              'value': 'border-color'
            },
            {
              'label': 'Border radius',
              'value': 'border-radius'
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
              'label': 'Font weight',
              'value': 'font-weight'
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
              'label': 'Max height',
              'value': 'max-height'
            },
            {
              'label': 'Width',
              'value': 'width'
            },
            {
              'label': 'Height',
              'value': 'height'
            },
            {
              'label': 'Text align',
              'value': 'text-align'
            },
            {
              'label': 'Float',
              'value': 'float'
            },
            {
              'label': 'Direction',
              'value': 'direction'
            },
            {
              'label': 'Display',
              'value': 'display'
            },
            {
              'label': 'Box shadow',
              'value': 'box-shadow'
            },
          ]
        },
        {
          name: 'value',
          type: 'text',
          label: 'CSS Value',
          type: 'string',
        },
        {
          name: 'mediaQuery',
          type: 'select',
          label: 'Media Query',
          choices: [
            {
              'label': 'None',
              'value': ''
            },
            {
              'label': 'Phone (767px and smaller)',
              'value': '@media screen and (max-width: 767px)'
            },
            {
              'label': 'Tablet (between 768px - 991px)',
              'value': '@media screen and (min-width: 768px) and (max-width: 991px)'
            },
            {
              'label': 'Tablet & phone (991px and smaller)',
              'value': '@media screen and (max-width: 991px)'
            },
            {
              'label': 'Desktop (min width 992px)',
              'value': '@media screen and (min-width: 992px)'
            },
          ]
        },


      ],
    }
  },
  format: (id, cssValues) => {

    let formattedStyles = '';

    const formatCSSLines = (cssValues) => {
      let formattedLine = '';
      cssValues.forEach((css) => {
        formattedLine += `${css.property}:${css.value};`;
      });

      return formattedLine;
    }

    if (cssValues) {
      /**
       * Format the main styles that are without media queries
       */
      const mainStyles = formatCSSLines(cssValues.filter((cssValue) => { return !cssValue.mediaQuery; }));
      formattedStyles = ` #${id}, .${id}{${mainStyles}} `;

      /**
       * Format the styles that depend on a media query
       */
      const mediaQueries = cssValues.filter(cssValue => !!cssValue.mediaQuery).map(cssValue => cssValue.mediaQuery);
      mediaQueries.forEach((mediaQuery) => {
        let mediaQueryStyle = formatCSSLines(cssValues.filter(cssValue => cssValue.mediaQuery && cssValue.mediaQuery ===  mediaQuery));
        if (mediaQueryStyle.length > 0) {
          mediaQueryStyle = ` #${id}, .${id}{${mediaQueryStyle}} `;
          formattedStyles += ` ${mediaQuery} { ${mediaQueryStyle} } `;
        }
      });
    }

    return formattedStyles;
  },
  generateId: () => {
    function makeid(length) {
       var result           = '';
       var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       var charactersLength = characters.length;
       for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
     return 'ID-' + makeid(22);
  }
}
