module.exports = (self, options) => {
  self.getApiSyncFields = (fields) => {
    if (!fields) {
      return [];
    }
    return fields.filter(field => {
      return field.apiSyncField;
    });
  };

  // Todo: move this to the global config logic module
  self.syncApiFields = (item, apiSyncFields, siteConfig, workflowLocale, body) => {
    apiSyncFields.forEach(field => {
      let value = self.getApiConfigValue(siteConfig, field.apiSyncField);
      if (workflowLocale && workflowLocale === 'default-draft') {
        value = typeof item[field.name] !== 'undefined' ? item[field.name] : value;
      } else if(body && body.data && body.data[field.name]) {
        value = self.getFieldValue(body.data, field);
      }

      item[field.name] = value;
    });

    return item;
  };

  self.getFieldValue = (item, field) => {
    if(field.type === 'integer') {
      return parseInt(item[field.name]);
    }

    return item[field.name];
  };

  self.setObjectValue = (obj, is, value) => {
    if (typeof is === 'string')
      return self.setObjectValue(obj, is.split('.'), value);
    else if (is.length === 1 && value !== undefined)
      return obj[is[0]] = value;
    else if (is.length === 0)
      return obj;
    else
      return self.setObjectValue(obj[is[0]], is.slice(1), value);
  };
};
