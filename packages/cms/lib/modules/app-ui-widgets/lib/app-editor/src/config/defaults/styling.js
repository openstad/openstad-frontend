/**
 * Styling is a resource object always location on the first row
 */
const stylingDefaults = [
    {
        defaults: [{
            fontFamily: 'Nunito_400Regular',
            primaryColor: '#000000',
            accentColor: '#888',
            backgroundColor: '#FFFFFF'
        }],
        logo: [{
           display: false,
           image: '',
           height: 20,
           width: 20
        }],
        title: [{
           fontColor: '#000000',
        }],
        subTitle: [{
            fontColor: '#000000',
        }],
        text: [{
            fontColor: '#000000',
        }],
        tabBarMenu: [{
            height: 80,
            fontSize: 14
        }],
        card: [{
            shadow: true,
            borderRadius: 10,
            fontStyle: 'Nunito_700Bold',
            fontColor: 'white',
            backgroundImage: true, //,
          //  backgroundColorSecondary: '#4d4e2f'
        }],
        // background
        button: [{
            shadow: true,
            borderRadius: 25,
            fontColor: '#fff',
        }],
    }
];

const fontOptions = [
    {
        value: 'Roboto_400Regular',
        label: 'Roboto_400Regular'
    },
    {
        value: 'Merriweather_400Regular',
        label: 'Merriweather_400Regular'
    },
    {
        value: 'Lobster_400Regular',
        label: 'Lobster_400Regular'
    },
    {
        value: 'Inconsolata_400Regular',
        label: 'Inconsolata_400Regular'
    },
    {
        value: 'OpenSans_400Regular',
        label: 'OpenSans_400Regular'
    },
    {
        value: 'Nunito_700Bold',
        label: 'Nunito_700Bold'
    },
    {
        value: 'Roboto_400Regular',
        label: 'Roboto_400Regular'
    },
    {
        value: 'Oswald_400Regular',
        label: 'Oswald_400Regular'
    },
    {
        value: 'Nunito_400Regular',
        label: 'Nunito_400Regular'
    },
    {
        value: 'Dosis_400Regular',
        label: 'Dosis_400Regular'
    },
    {
        value: 'Amiri_400Regular',
        label: 'Amiri_400Regular'
    },
];

const booleanOptions =[{
    label: 'Yes',
    value: true
}, {
    label: 'No',
    value: false
}]

const stylingSchema = {
    name: "styling",
    label: "Styling",
    fields: [
        {
            label: 'General',
            key: 'general',
            type: 'object',
            single: true,
            fields: [
                {
                    label: 'Font family',
                    key: 'fontFamily',
                    type: 'select',
                    options: fontOptions
                },

                {
                    label: 'Primary color',
                    key: 'primaryColor',
                    help: 'Primary color is used as an accent color in button, links etc.',
                    type: 'color'
                },
                {
                    label: 'Secondary color',
                    key: 'secondaryColor',
                    help: 'Secondary color is used for details like ...',
                    type: 'color'
                },
                {
                    label: 'Background color',
                    key: 'backgroundColor',
                    type: 'color'
                },
                {
                    label: 'Font color',
                    key: 'fontColor',
                    type: 'color'
                }
            ]
        },
        {
            label: 'Logo',
            key: 'logo',
            type: 'object',
            single: true,
            fields: [
                {
                    label: 'Display a logo',
                    key: 'displayLogo',
                    type: 'select',
                    options: booleanOptions
                },
                {
                    label: 'Image',
                    key: 'src',
                    type: 'image'
                },
                {
                    label: 'Width',
                    key: 'width',
                    type: 'number'
                },
                {
                    label: 'Height',
                    key: 'height',
                    type: 'number'
                }
            ]
        },
        {
            label: 'Card',
            key: 'card',
            type: 'object',
            single: true,
            fields: [
                {
                    label: 'Display a shadow?',
                    key: 'shadow',
                    type: 'select',
                    options: booleanOptions
                },
                {
                    label: 'Border radius',
                    key: 'borderRadius',
                    type: 'image'
                },
                {
                    label: 'Use background image',
                    key: 'displayBackgroundImage',
                    type: 'select',
                    options: booleanOptions
                }
            ]
        },
        {
            label: 'Buttons',
            key: 'button',
            type: 'object',
            single: true,
            fields: [
                {
                    label: 'Display a shadow?',
                    key: 'shadow',
                    type: 'select',
                    options: booleanOptions
                },
                {
                    label: 'Border radius',
                    key: 'borderRadius',
                    type: 'number'
                }
            ]
        }
    ]
}

export default {
    schema: stylingSchema,
    defaults: stylingDefaults
}
