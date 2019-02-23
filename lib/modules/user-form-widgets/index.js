module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Form',
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
              value: 'multiple-choice',
            },
            {
              label: 'Text',
              value: 'text',
            },
            {
              label: 'Textarea',
              value: 'textarea',
            },
            {
              label: 'Image upload',
              value: 'image-upload',
            },
            {
              label: 'Locatie picker',
              value: 'location-picker',
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

     self.route('post', 'submit', function(req, res) {
       //let auth = `Basic ${new Buffer("openstad:op3nstad#").toString("base64")}`//
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const appUrl = self.apos.settings.getOption(req, 'appUrl');

       const siteId = 1;
       const ideaId = 3;
       const body = {};
       const auth = ` Bearer ${req.session.jwt}`;
       const errors = []
       const isValid = () => {
         return true;
       }

       /**
        * How do we secure the API?
        */
       data.widget.formFields.forEach((field) => {
         let fieldKey = field.inputKey;
         let fieldValue = req.body[field.inputKey];

         if (isValid()) {
           body[fieldKey] = fieldValue;
         } else {
           errors.push(`${field.title} niet correct ingevuld`);
         }
       });


       const options = {
          method: 'POST',
           uri:  apiUrl + `/api/site/${siteId}/submission`,
           headers: {
             'Accept': 'application/json',
      //         "Authorization" : auth,
           },
           body: req.body,
           json: true // Automatically parses the JSON string in the response
       };

       rp(options)
         .then(function (response) {
            res.redirect(req.header('Referer')  || appUrl);
         })
         .catch(function (err) {
            res.redirect(req.header('Referer')  || appUrl);
         });

      // Access req.body here
      // Send back an AJAX response with `res.send()` as you normally do with Express
    });
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
