module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Vote form',
  addFields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
    },
    {
      type: 'string',
      name: 'intro',
      label: 'Intro',
      textarea: true
    },
    {
      name: 'formFields',
      label: 'Form fields',
      type: 'array',
      titleField: 'Form fields',
      required: true,
      schema: [
        {
          type: 'string',
          name: 'title',
          label: 'Title'
        },
        {
          name: 'inputType',
          label: 'Type veld',
          type: 'select',
          choices: [
            {
              label: 'Multiple choice',
              value: 'multipleChoice',
            },
            {
              label: 'Text',
              value: 'text',
            },
            {
              label: 'Bestandsupload',
              value: 'fileupload',
            }
          ]
        },
        {
          name: 'choices',
          label: 'Keuzes (enkel voor multiple choice)',
          type: 'array',
          schema: [
            {
              name: 'image',
              type: 'attachment',
              label: 'Icon',
              required: false
            },
            {
              type: 'string',
              name: 'title',
              label: 'Titel'
            },
            {
              type: 'string',
              name: 'value',
              label: 'Waarde'
            }
          ]
        },
        {
          type: 'string',
          name: 'inputKey',
          label: 'Key (waaronder op te slaan)'
        },
        {
          type: 'string',
          name: 'validation',
          label: 'Validatie (Komma gescheiden, bv: required, postcode, min2)',
        },
        {
          type: 'string',
          name: 'options',
          label: 'Configuratie',
          textarea: true
        }
      ]
    },
    {
      name: 'backgroundColor',
      type: 'color',
      label: 'Background color',
    },
    {
      name: 'padding',
      type: 'string',
      label: 'Padding',
    },
  ],
  construct: function(self, options) {
     var superPushAssets = self.pushAssets;
     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
     };
/*
     var superOutput = self.output;
     self.output = function(widget, options) {
       widget.formFields = widget.formFields.map((formField) => {
         let validationArray = formField.validation.length > 0 ? formField.validation.join(',').map(field => 'validate-' + field.trim()) : [];
         formField.inputAttributes = [];
         formField.inputClasses = validationArray;
       });


       return result;
     };

     */
  }
};
