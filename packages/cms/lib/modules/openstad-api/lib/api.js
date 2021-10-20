const request = require('request-promise');

module.exports = (self, options) => {

  self.init = (req) => {
    const siteConfig = self.apos.settings.getOption(req, 'siteConfig');
    self.siteId = siteConfig.id;
    self.apiUrl = process.env.INTERNAL_API_URL || self.apos.settings.getOption(req, 'apiUrl');
    self.sessionJwt = req.session.jwt;
  };

  self.updateSiteConfig = async (req, siteConfig, item, apiSyncFields) => {

    apiSyncFields.forEach(field => {
      //item is the inter global config
      const value = self.getFieldValue(item, field);
      self.setApiConfigValue(siteConfig, field.apiSyncField, value);
    });

    const config = Object.assign({}, siteConfig);
    const areaId = config.area && config.area.id || null;

    // @todo: fix this in a configurable way, currently we add the id, title and area to the siteconfig,
    // and this is a quick and dirty way to not save them to the database
    if (config.id) delete config.id;
    if (config.title) delete config.title;
    if (config.area) delete config.area;
    
    await self.updateSite({
      id: config.id,
      areaId,
      config
    });

    self.refreshSiteConfig();
  };

  self.refreshSiteConfig = async () => {
    const siteData = await self.getSite();
    const config = siteData.config;
    config.id = siteData.id;
    config.title = siteData.title;
    config.area = siteData.area;



    self.apos.settings.options.siteConfig = config;
  };

  self.getOptions = (additionalOptions) => {
    return Object.assign({
      headers: {
        'Accept': 'application/json',
      },
      json: true
    }, additionalOptions);
  };

  self.getOptionsWithAuth = (additionalOptions) => {
    const headers = {
      'Accept': 'application/json',
    };

    if (self.sessionJwt) {
      headers["X-Authorization"] = `Bearer ${self.sessionJwt}`;
    }

    return self.getOptions(Object.assign({'headers': headers}, additionalOptions));
  };

  self.getSite = async (req, siteId, sort) => {
    // FIXME: Create a better way to get the site config or authenticate as a admin
    const options = self.getOptions({
      uri: `${self.apiUrl}/api/site/${self.siteId}`,
      headers: {
        "X-Authorization": process.env.SITE_API_KEY
      }
    });

    return request(options);
  };

  self.getAllIdeas = async (req, siteId, sort) => {
    const options = self.getOptions({
      uri: `${self.apiUrl}/api/site/${siteId}/idea?sort=${sort}&includeVoteCount=1&includeUserVote=1&includeArgsCount=1`,
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

  /**
   *
   * @param {string} label
   * @returns {Promise<*|null>}
   */
  self.getNotificationRuleSetByName = async (label) => {
    const options = self.getOptionsWithAuth({
      method: 'GET',
      uri: `${self.apiUrl}/api/site/${self.siteId}/notification/ruleset/?includeTemplate=true&includeRecipients=true&label=${label}`,

    });

    const result = await request(options);

    return result[0] ? result[0] : null
  };

  /**
   * Add or update resource
   * @param data
   * @param resourcePath
   * @returns {Promise<*>}
   */
  self.addOrUpdateResource = async (data, resourcePath) => {
    const options = self.getOptionsWithAuth({
      method: 'POST',
      uri: `${self.apiUrl}/api/site/${self.siteId}/${resourcePath}`,
      body: data,
    });

    if (data.id) {
      options.method = 'PUT'
    }

    return request(options);
  }

  self.addOrUpdateNotificationTemplate = async (data) => {
    return self.addOrUpdateResource(data, 'notification/template');
  };

  self.addOrUpdateNotificationRuleSet = async (data) => {
    return self.addOrUpdateResource(data, 'notification/ruleset');
  };

  self.addOrUpdateNotificationRecipient = async (data) => {
    return self.addOrUpdateResource(data, 'notification/recipient');
  };

  /**
   * Delete Ruleset by id
   * @param {int} id
   * @returns {Promise<void>}
   */
  self.deleteNotificationRuleSet = async (id) => {
    const options = self.getOptionsWithAuth({
      method: 'DELETE',
      uri: `${self.apiUrl}/api/site/${self.siteId}/notification/ruleset/${id}`
    });

    return request(options);
  }

  /**
   * Delete Template by id
   * @param {int} id
   * @returns {Promise<void>}
   */
  self.deleteNotificationTemplate = async (id) => {
    const options = self.getOptionsWithAuth({
      method: 'DELETE',
      uri: `${self.apiUrl}/api/site/${self.siteId}/notification/template/${id}`
    });

    return request(options);
  }

  /**
   * Delete Recipient by id
   * @param {int} id
   * @returns {Promise<void>}
   */
  self.deleteNotificationRecipient = async (id) => {
    const options = self.getOptionsWithAuth({
      method: 'DELETE',
      uri: `${self.apiUrl}/api/site/${self.siteId}/notification/recipient/${id}`
    });

    return request(options);
  }

  self.getAllPolygons = async () => {
    const options = self.getOptions({
      method: 'GET',
      uri: `${self.apiUrl}/api/area`,
    });

    return request(options);
  }
};
