/**
 * A few basic styles configurable.
 * Buttons are now a mess, many different styles merged into one.
 * @todo: A start has been made to reduce the classes, but needs more work.
 * @todo: Links with > are not changable in color right now because an icon in stead of font is used
 */
exports.fields = [
  {
    name: 'backgroundNavColor',
    label: 'Background color of the navigation bar',
    type: 'color',
    selector: '#navbar',
    property: 'background-color',
  },
  {
    name: 'textNavColor',
    label: 'Text color of the items in the navigation bar',
    type: 'color',
    selector: '#navbar a',
    property: 'color',
  },
  {
    name: 'textHoverNavColor',
    label: 'Text color when hovering over the items in the navigation bar',
    type: 'color',
    selector: '#navbar a:hover',
    property: 'color',
  },
  {
    name: 'textLineNavColor',
    label: 'Color of the underline of the items in the navigation bar',
    type: 'color',
    unit: '!important',
    selector: '#mainMenu .nav-link',
    property: 'border-color',
  },
  {
    name: 'backgroundFooterColor',
    label: 'Background color of the footer',
    type: 'color',
    selector: 'footer',
    property: 'background-color',
  },
  {
    name: 'textFooterColor',
    label: 'Color of the text in the footer',
    type: 'color',
    selector: ['footer .container h2', 'footer .container p', 'footer .container a'],
    property: 'color',
  },
  {
    name: 'logoWidth',
    label: 'Logo breedte',
    type: 'range',
    selector: ['#logo-image'],
    property: ['width'],
    min: 25,
    max: 300,
    step: 1,
    unit: 'px',
    //      mediaQuery: '(max-width: 59.99em)'
  },
  {
    name: 'logoWidthMobile',
    label: 'Logo breedte mobile',
    type: 'range',
    selector: ['#logo-image'],
    property: ['width'],
    min: 25,
    max: 300,
    step: 1,
    unit: 'px',
    mediaQuery: '(max-width: 768px)'
  },
  {
    name: 'headerPadding',
    label: 'Header padding (spacing between logo/menu)',
    type: 'range',
    selector: ['header'],
    property: ['padding-top', 'padding-bottom'],
    min: 0,
    max: 125,
    step: 1,
    unit: 'px'
  },
  {
    name: 'headerPaddingMobile',
    label: 'Header padding mobile (spacing between logo/menu)',
    type: 'range',
    selector: ['header'],
    property: ['padding-top', 'padding-bottom'],
    min: 0,
    max: 125,
    step: 1,
    unit: 'px',
    mediaQuery: '(max-width: 768px)'
  },
  {
    name: 'CTAButtonBgColor',
    label: 'Background color of the button in the menu',
    type: 'color',
    selector: ['#mainMenu .menu-cta-button'],
    property: ['background-color', 'border-color'],
  },
  {
    name: 'CTAButtonFontColor',
    label: 'Font color of the CTA button in the menu',
    type: 'color',
    selector: ['#mainMenu .menu-cta-button'],
    property: 'color',
  },
  {
    name: 'CTAButtonHoverBgColor',
    label: 'Background color of the button in the menu - hover',
    type: 'color',
    selector: ['#mainMenu .menu-cta-button:hover'],
    property: ['background-color', 'border-color'],
  },
  {
    name: 'CTAButtonHoverFontColor',
    label: 'Font color of the CTA button in the menu - hover',
    type: 'color',
    selector: ['#mainMenu .menu-cta-button:hover'],
    property: 'color',
  },
  {
    name: 'buttonColor',
    label: 'Background color of button',
    type: 'color',
    selector: ['a.page-button-flag', '.filled-button', '.btn-primary', '.btn--blue', '.begroot-container .button-add-idea-to-budget',' #map-with-buttons-container .no-of-locations-content', '.no-of-locations-content', '#title .secondary .controls .vote button', '#title .secondary .controls .vote button.idea-status-OPEN:disabled',  '#title .secondary .controls .no-of-votes-for-content', '#title .secondary .controls .no-of-votes-against-content' ],
    property: ['background-color', 'border-color'],
  },
  {
    name: 'buttonFontColor',
    label: 'Font color of button',
    type: 'color',
    selector: ['a.page-button-flag', '.filled-button', '.btn-primary', '.btn--blue', '.begroot-container .button-add-idea-to-budget',' #map-with-buttons-container .no-of-locations-content',  '.no-of-locations-content', '#title .secondary .controls .vote button', '#title .secondary .controls .no-of-votes-for-content', '#title .secondary .controls .no-of-votes-against-content' ],
    property: 'color',
  },

  {
    name: 'buttonHoverBgColor',
    label: 'Background color of button - hover',
    type: 'color',
    selector: ['a.page-button-flag:hover', '.filled-button:hover', '.btn-primary:hover', '.btn--blue:hover', '.begroot-container .button-add-idea-to-budget:hover',  '#title .secondary .controls .vote button:hover', '#title .secondary .controls .vote button.idea-status-OPEN:disabled:hover' ],
    property: ['background-color', 'border-color'],
  },
  {
    name: 'buttonHoverFontBgColor',
    label: 'Font color of button - hover',
    type: 'color',
    selector: ['a.page-button-flag:hover', '.filled-button:hover', '.btn-primary:hover', '.btn--blue:hover', '.begroot-container .button-add-idea-to-budget:hover',  '#title .secondary .controls .vote button:hover'  ],
    property: 'color',
  },
  {
    name: 'buttonBorderRadius',
    label: 'Border radius of button',
    type: 'range',
    selector: ['a.page-button-flag', '.filled-button', '.outlined-button', '.btn-primary', '.btn--blue', '.btn', '.btn-primary', '.menu-cta-button' ],
    property: 'border-radius',
    min: 0,
    max: 50,
    step: 1,
    unit: 'px',
  },
  {
    name: 'buttonOutlinedColor',
    label: 'Outlined color of button',
    type: 'color',
    selector: ['.outlined-button', '.outlined-button:hover', '.outlined-button:visited', '.begroot-container .button-add-idea-to-budget.added', '.begroot-container .button-add-idea-to-budget.added:hover'],
    property: ['color', 'border-color', 'outline-color'],
  },
  {
    name: 'linkColor',
    label: 'Color of link (in text)',
    type: 'color',
    selector: ['a'],
    property: 'color',
  },
  {
    name: 'linkVisitedColor',
    label: 'Color of button',
    type: 'color',
    selector: ['a'],
    property: 'color',
  },
];


exports.arrangeFields = [

  {
    name: 'logoFields',
    label: 'Logo',
    fields: ['logoWidth', 'logoWidthMobile']
  },
  {
    name: 'colorFields',
    label: 'Header',
    fields: [
      'headerPadding',
      'headerPaddingMobile',
      'backgroundNavColor',
      'textNavColor',
      'textHoverNavColor',
      'textLineNavColor',
      'CTAButtonBgColor',
      'CTAButtonFontColor',
      'CTAButtonHoverBgColor',
      'CTAButtonHoverFontColor'
    ]
  },
  {
    name: 'buttons',
    label: 'Buttons & links',
    fields: ['buttonColor', 'buttonFontColor', 'buttonHoverBgColor', 'buttonHoverFontBgColor', 'buttonBorderRadius','buttonOutlinedColor', 'linkColor', 'linkVisitedColor']
  },
  {
    name: 'footer',
    label: 'Footer',
    fields: ['backgroundFooterColor', 'textFooterColor']
  },
]
