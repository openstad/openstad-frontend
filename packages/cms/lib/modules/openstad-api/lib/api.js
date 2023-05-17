const fetch = require('node-fetch');

module.exports = (self, options) => {

  self.init = (req) => {
    const siteConfig = self.apos.settings.getOption(req, 'siteConfig');
    self.siteId = siteConfig.id;
    self.apiUrl = process.env.INTERNAL_API_URL || self.apos.settings.getOption(req, 'apiUrl');
    self.sessionJwt = req.session.jwt;
  };

  self.updateSiteConfig = async (req, siteConfig, item, apiSyncFields) => {
    apiSyncFields.forEach(field => {
      if(field.name === 'ideaSlug') {
        siteConfig.ideas.feedbackEmail["inzendingPath"] = item.ideaSlug;
        siteConfig.ideas.conceptEmail["inzendingPath"] = item.ideaSlug;
        siteConfig.ideas.conceptToPublishedEmail["inzendingPath"] = item.ideaSlug;
      }
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

  
  self.getSite = async (req, siteId, sort) => {

    try {
      let response = await fetch(`${self.apiUrl}/api/site/${self.siteId}`, {
        headers: {
          'Accept': 'application/json',
          "X-Authorization": process.env.SITE_API_KEY
        },
        method: 'GET',
      })
      if (!response.ok) {
        console.log(response);
        throw new Error('Fetch failed')
      }
      return await response.json();
    } catch(err) {
      console.log(err);
      throw err;
    }

  };

  self.getAllIdeas = async (req, siteId, sort) => {

    try {
      let response = await fetch(`${self.apiUrl}/api/site/${siteId}/idea?sort=${sort}&includeVoteCount=1&includeUserVote=1&includeArgsCount=1`, {
        headers: {
          'Accept': 'application/json',
        },
        method: 'GET',
      })
      if (!response.ok) {
        console.log(response);
        throw new Error('Fetch failed')
      }
      return await response.json();
    } catch(err) {
      console.log(err);
      throw err;
    }

  };

  self.updateSite = async (data) => {

    try {
      let response = await fetch(`${self.apiUrl}/api/site/${self.siteId}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "X-Authorization": process.env.SITE_API_KEY
        },
        method: 'PUT',
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        console.log(response);
        throw new Error('Fetch failed')
      }
      return await response.json();
    } catch(err) {
      console.log(err);
      throw err;
    }

  };

  /**
   *
   * @param {string} label
   * @returns {Promise<*|null>}
   */
  self.getNotificationRuleSetByName = async (label) => {

    try {
      let response = await fetch(`${self.apiUrl}/api/site/${self.siteId}/notification/ruleset/?includeTemplate=true&includeRecipients=true&label=${label}`, {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "X-Authorization": self.sessionJwt ?  `Bearer ${self.sessionJwt}` : '',
      })
      if (!response.ok) {
        console.log(response);
        throw new Error('Fetch failed')
      }
      let result = await response.json();
      return result[0] ? result[0] : null;
    } catch(err) {
      console.log(err);
    }

  };

  /**
   * Add or update resource
   * @param data
   * @param resourcePath
   * @returns {Promise<*>}
   */
  self.addOrUpdateResource = async (data, resourcePath) => {

    try {
      let response = await fetch(`${self.apiUrl}/api/site/${self.siteId}/${resourcePath}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "X-Authorization": self.sessionJwt ?  `Bearer ${self.sessionJwt}` : '',
        },
        method: data.id ? 'PUT' : 'POST',
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        console.log(response);
        throw new Error('Fetch failed')
      }
      return await response.json();
    } catch(err) {
      console.log(err);
      throw err;
    }
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

    try {
      let response = await fetch(`${self.apiUrl}/api/site/${self.siteId}/notification/ruleset/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "X-Authorization": self.sessionJwt ?  `Bearer ${self.sessionJwt}` : '',
        },
        method: 'DELETE',
      })
      if (!response.ok) {
        console.log(response);
        throw new Error('Fetch failed')
      }
      return await response.json();
    } catch(err) {
      console.log(err);
      throw err;
    }

  }

  /**
   * Delete Template by id
   * @param {int} id
   * @returns {Promise<void>}
   */
  self.deleteNotificationTemplate = async (id) => {

    try {
      let response = await fetch(`${self.apiUrl}/api/site/${self.siteId}/notification/template/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "X-Authorization": self.sessionJwt ?  `Bearer ${self.sessionJwt}` : '',
        },
        method: 'DELETE',
      })
      if (!response.ok) {
        console.log(response);
        throw new Error('Fetch failed')
      }
      return await response.json();
    } catch(err) {
      console.log(err);
      throw err;
    }

  }

  /**
   * Delete Recipient by id
   * @param {int} id
   * @returns {Promise<void>}
   */
  self.deleteNotificationRecipient = async (id) => {

    try {
      let response = await fetch(`${self.apiUrl}/api/site/${self.siteId}/notification/recipient/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "X-Authorization": self.sessionJwt ?  `Bearer ${self.sessionJwt}` : '',
        },
        method: 'DELETE',
      })
      if (!response.ok) {
        console.log(response);
        throw new Error('Fetch failed')
      }
      return await response.json();
    } catch(err) {
      console.log(err);
      throw err;
    }

  }

  self.getAllPolygons = async () => {

    try {
      let response = await fetch(`${self.apiUrl}/api/area`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })
      if (!response.ok) {
        console.log(response);
        throw new Error('Fetch failed')
      }
      return await response.json();
    } catch(err) {
      console.log(err);
      throw err;
    }

  }
};
