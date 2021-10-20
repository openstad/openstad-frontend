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
  getHelperClassesField: (name, label) => {
    return {
      name: name ? name : 'cssHelperClasses',
      label: label ? label : 'Styling classes',
      type: 'checkboxes',
      choices: [
        {
          'label': 'Overflow hidden',
          'value': 'overflow-hidden'
        },
        {
          'label': 'Display block',
          'value': 'display-block'
        },
        {
          'label': 'Rounded corners s',
          'value': 'rounder-corder-xs'
        },
        {
          'label': 'Rounded corners m',
          'value': 'rounder-corder-s'
        },
        {
          'label': 'Rounded corners lg',
          'value': 'rounder-corder-lg'
        },
        {
          'label': 'Margin top 0',
          'value': 'margin-top-0'
        },
        {
          'label': 'Margin bottom 0',
          'value': 'margin-bottom-0'
        },
        {
          'label': 'Margin top and bottom s',
          'value': 'margin-top-bottom-s'
        },
        {
          'label': 'Margin top and bottom m',
          'value': 'margin-top-bottom-m'
        },
        {
          'label': 'Margin top and bottom lg',
          'value': 'margin-top-bottom-lg'
        },
        {
          'label': 'Padding full s',
          'value': 'padding-full-s'
        },
        {
          'label': 'Padding full m',
          'value': 'padding-full-m'
        },
        {
          'label': 'Padding full lg',
          'value': 'padding-full-lg'
        },
        {
          'label': 'Padding top and bottom s',
          'value': 'padding-top-bottom-s'
        },
        {
          'label': 'Padding top and bottom m',
          'value': 'padding-top-bottom-m'
        },
        {
          'label': 'Padding top and bottom lg',
          'value': 'padding-top-bottom-lg'
        },
        {
          'label': 'Text color white',
          'value': 'text-color-white'
        },
        {
          'label': 'Text color grey',
          'value': 'text-color-grey'
        },
        {
          'label': 'Text color black',
          'value': 'text-color-black'
        },
        {
          'label': 'Font size xs',
          'value': 'font-size-xs'
        },
        {
          'label': 'Font size s',
          'value': 'font-size-s'
        },
        {
          'label': 'Font size m',
          'value': 'font-size-m'
        },
        {
          'label': 'Font size lg',
          'value': 'font-size-lg'
        },
        {
          'label': 'Font size xl',
          'value': 'font-size-xl'
        },
        {
          'label': 'Font italic',
          'value': 'font-italic'
        },
        {
          'label': 'Font bold',
          'value': 'font-bold'
        },
        {
          'label': 'Text underline',
          'value': 'text-underline'
        },
        {
          'label': 'Box shadow s',
          'value': 'box-shadow-s'
        },
        {
          'label': 'Box shadow m',
          'value': 'box-shadow-m'
        },
        {
          'label': 'Border thin grey',
          'value': 'border-thin-grey'
        },
        {
          'label': 'Border thin blue',
          'value': 'border-thin-blue'
        },
        {
          'label': 'Border thin black',
          'value': 'border-thin-black'
        },
        {
          'label': 'Center container (needs a width or max width)',
          'value': 'center-container'
        },
        {
          'label': 'Max width s',
          'value': 'max-width-s'
        },
        {
          'label': 'Max width m',
          'value': 'max-width-m'
        },
        {
          'label': 'Max width lg',
          'value': 'max-width-lg'
        },
        {
          'label': 'Text align left',
          'value': 'text-align-left'
        },
        {
          'label': 'Text align center',
          'value': 'text-align-center'
        },
        {
          'label': 'Text align right',
          'value': 'text-align-right'
        },
      ]
    }
  },
}
