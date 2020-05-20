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
];

exports.arrangeFields = [
  {
    name: 'colorFields',
    label: 'Kleuren',
    fields: ['backgroundNavColor', 'textNavColor', 'textHoverNavColor', 'textLineNavColor', 'backgroundFooterColor', 'textFooterColor']
  },
  {
    name: 'logoFields',
    label: 'Logo instellingen',
    fields: ['logoWidth']
  },
]
