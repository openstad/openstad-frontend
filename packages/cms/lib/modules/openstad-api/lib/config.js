module.exports = (self, options) => {
  self.setApiConfigValue = (config, field, value) => {
    self.setObjectValue(config, field, value);
  };

  self.getApiConfigValue = (config, field) => {
    return self.getObjectValue(config, field);
  };

  // Todo: move this to the global config logic module
  self.syncApiFields = (item, apiSyncFields, siteConfig, workflowLocale, body) => {
    if (apiSyncFields) {
      apiSyncFields.forEach(field => {

        let value = self.getApiConfigValue(siteConfig, field.apiSyncField);

        if (workflowLocale && workflowLocale === 'default-draft') {
          value = typeof item[field.name] !== 'undefined' ? item[field.name] : value;
        } else if(body && body.data && body.data[field.name]) {
          value = self.getFieldValue(body.data, field);
        }

        item[field.name] = value;
      });
    }

    return item;
  };
};
