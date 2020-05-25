const request = require('request-promise');

module.exports = (self, options) => {

  self.init = (req) => {
    const siteConfig = self.apos.settings.getOption(req, 'siteConfig');
    self.siteId = siteConfig.id;
    self.apiUrl = process.env.INTERNAL_API_URL || self.apos.settings.getOption(req, 'apiUrl');
    self.sessionJwt = req.session.jwt;
  };

  self.setApiConfigValue = (config, field, value) => {
    self.setObjectValue(config, field, value);
  };

  self.getApiConfigValue = (config, field) => {
    return self.setObjectValue(config, field);
  };

  self.updateSiteConfig = async (siteConfig, item, apiSyncFields) => {

    apiSyncFields.forEach(field => {
      const value = self.getFieldValue(item, field);
      self.setApiConfigValue(siteConfig, field.apiSyncField, value);
    });
    
    const data = siteConfig;
    
    if (item.mapPolygonsKey) {
      data.areaId = item.mapPolygonsKey;
    } else {
      data.areaId = null;
    }
    
    // @todo: fix this in a configurable way, currently we add the id, title and area to the siteconfig, and this is a quick and dirty way to not save them to the database
    // @todo: if we remove data.id the data isn't saved in the API, but we don't need this value in the sites.config, handle this on the API side
    //if (data.id) delete data.id;
    if (data.title) delete data.title;
    if (data.area) delete data.area;
    
    return self.updateSite(data);
  };

  self.getOptions = (additionalHeaders) => {
    return Object.assign({
      headers: {
        'Accept': 'application/json',
      },
      json: true
    }, additionalHeaders);
  };

  self.getOptionsWithAuth = (additionalHeaders) => {
    return self.getOptions(Object.assign({
      headers: {
        'Accept': 'application/json',
        'X-Authorization': `Bearer ${self.sessionJwt}`
      }
    }, additionalHeaders));
  };

  self.getAllIdeas = async (req, siteId, sort) => {
    const options = self.getOptions({
      uri: `${self.apiUrl}/api/site/${siteId}/idea?sort=${sort}&includeVoteCount=1&includeUserVote=1`,
    });

    return request(options);
  };

  self.updateSite = async (data) => {
    const options = self.getOptionsWithAuth({
      method: 'PUT',
      uri: `${self.apiUrl}/api/site/${self.siteId}`,
      body: data,
    });


    return request(options);
  };
  
  self.getAllPolygons = async () => {
    const options = self.getOptionsWithAuth({
      method: 'GET',
      uri: `${self.apiUrl}/api/area`,
    });
    
    return request(options);
  }
};
