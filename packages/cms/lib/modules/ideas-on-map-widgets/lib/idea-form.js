let ideaForm = {}

ideaForm.getWidgetFormFields = function(widget, formFieldsName = 'formFields') {
  // apostrophe does not allow defaults for fields of type 'array' but this works:
  if (!widget[formFieldsName] || !widget[formFieldsName].length) {
    widget[formFieldsName] = [
      { name: 'title',
        title: 'Titel',
        inputType: 'text-with-counter'
      }, {
        name: 'summary',
        title: 'Samenvatting',
        inputType: 'textarea-with-counter'
      }, {
        name: 'description',
        title: 'Beschrijving',
        inputType: 'textarea-with-counter',
      }, {
        name: 'extraData.images',
        title: 'Image',
        inputType: 'image-upload',
      },
    ];
  }
  return widget[formFieldsName];
}

module.exports = exports = ideaForm;
