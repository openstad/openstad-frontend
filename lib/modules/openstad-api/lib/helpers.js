module.exports = (self, options) => {
  self.getApiSyncFields = (fields) => {
    if (!fields) {
      return [];
    }
    return fields.filter(field => {
      return field.apiSyncField;
    });
  };

  self.getFieldValue = (item, field) => {
    if(field.type === 'integer') {
      return parseInt(item[field.name]);
    }

    return item[field.name];
  };

  self.getObjectValue = (obj, is) => {
    if (typeof is === 'string')
      return self.getObjectValue(obj, is.split('.'));
    else if (is.length === 0)
      return obj;
    else {
      if(!obj)
        return obj;

      return self.getObjectValue(obj[is[0]], is.slice(1));
    }
  }

  self.setObjectValue = (obj, is, value) => {
    if (typeof is === 'string')
      return self.setObjectValue(obj, is.split('.'), value);
    else if (is.length === 1 && value !== undefined)
      return obj[is[0]] = value;
    else if (is.length === 0)
      return obj;
    else if (is.length > 1 && obj[is[0]] === null) {
      obj[is[0]] = {};
      return self.setObjectValue(obj[is[0]], is.slice(1), value);
    } else {
      return self.setObjectValue(obj[is[0]], is.slice(1), value);
    }
  };
};
