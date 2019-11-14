module.exports = function (formFields) {
    let mappedValidations = {};
    
    formFields.forEach((field) => {
        if (field.inputType == 'image-upload') {
            return;
        }
        
       let validations = field.validation.split(',');
       let mapped = {};
       
       validations.forEach((validation) => {
           if (validation.indexOf(':') < 0) {
               mapped[validation.trim()] = true;
           } else {
               let split = validation.split(':');
               mapped[split[0].trim()] = split[1].trim();
           }
       });
       
       mappedValidations[`data[${field.inputKey}]`] = mapped;
       
    });
    
    return mappedValidations;
};
