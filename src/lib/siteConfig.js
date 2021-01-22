const merge             = require('merge');
const config            = require('config');
const defaultSiteConfig = require('./defaultSiteConfig');

module.exports = {
  config: defaultSiteConfig,
  
  setFromSite: function (site) {
    this.config = merge.recursive(this.config, config || {});
    
    // Exceptions from local config because field names don't match
    this.config.cms.url = config.url || this.config.title;
    this.config.cms.hostname = config.hostname || this.config.title;
    this.config.title = config.siteName || this.config.title;
    this.config.newslettersignup.confirmationEmail.attachments = (config.ideas && config.ideas.feedbackEmail && config.ideas.feedbackEmail.attachments) || this.config.newslettersignup.confirmationEmail.attachments;
    this.config.newslettersignup.confirmationEmail.subject = (config.ideas && config.ideas.feedbackEmail && config.ideas.feedbackEmail.subject) || this.config.newslettersignup.confirmationEmail.subject;
    
    this.config = merge.recursive(this.config, site.config || {});
    
    // Put the title in the config as well
    this.config.title = site.title || this.config.title;
  },
  
  getTitle: function () {
    return this.config.title;
  },
  
  getCmsUrl: function () {
    return this.config.cms.url;
  },
  
  getCmsHostname: function () {
    return this.config.cms.hostname;
  },
  
  getResourceConfig: function (resourceType) {
    return this.config[resourceType] || {};
  },

  getResourceFeedbackEmail: function (resourceType) {
    return this.getResourceConfig(resourceType).feedbackEmail || {};
  },

  getFeedbackEmailFrom: function (resourceType) {
    resourceType = resourceType || 'ideas'
    return this.getResourceFeedbackEmail(resourceType).from;
  },
  
  getFeedbackEmailInzendingPath: function (resourceType) {
    return this.getResourceFeedbackEmail(resourceType).inzendingPath;
  },
  
  getResourceFeedbackEmailTemplate: function (resourceType) {
    return this.getResourceFeedbackEmail(resourceType).template;
  },
  
  getResourceFeedbackEmailAttachments: function (resourceType) {
    return this.getResourceFeedbackEmail(resourceType).attachments;
  },
  
  getResourceFeedbackEmailSubject: function (resourceType) {
    return this.getResourceFeedbackEmail(resourceType).subject;
  },
  
  getMailMethod: function () {
    return this.config.mail.method;
  },
  
  getMailTransport: function () {
    return this.config.mail.transport[this.getMailMethod()];
  },
  
  getNewsletterSignupConfirmationEmailUrl: function () {
    return this.config.newslettersignup.confirmationEmail.url;
  },
  
  getNewsletterSignupConfirmationEmailTemplate: function () {
    return this.config.newslettersignup.confirmationEmail.template;
  },
  
  getNewsletterSignupConfirmationEmailAttachments: function () {
    return this.config.newslettersignup.confirmationEmail.attachments || this.getDefaultEmailAttachments();
  },
  
  getNewsletterSignupConfirmationEmailSubject: function () {
    return this.config.newslettersignup.confirmationEmail.subject;
  },
  
  getLogo: function () {
    let logo = this.config.styling.logo;
  
    if (process.env.LOGO) {
      logo = process.env.LOGO;
    }
    
    return logo;
  },
  
  getDefaultEmailAttachments: function () {
    const logo = this.getLogo();
    const attachments = [];
    
    // if logo is amsterdam, we fallback to old default logo and include it
    if (logo === 'amsterdam') {
      attachments.push('logo.png');
    }
  
    if (!logo) {
      attachments.push('openstad-logo.png');
    }
    
    return attachments;
  }
  
};
