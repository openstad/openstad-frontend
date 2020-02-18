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
  
  getIdeasFeedbackEmailFrom: function () {
    return this.config.ideas.feedbackEmail.from;
  },
  
  getIdeasFeedbackEmailSubject: function () {
    return this.config.ideas.feedbackEmail.subject;
  },
  
  getIdeasFeedbackEmailInzendingPath: function () {
    return this.config.ideas.feedbackEmail.inzendingPath;
  },
  
  getIdeasFeedbackEmailTemplate: function () {
    return this.config.ideas.feedbackEmail.template;
  },
  
  getIdeasFeedbackEmailAttachments: function () {
    return this.config.ideas.feedbackEmail.attachments;
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
    return this.config.newslettersignup.confirmationEmail.attachments;
  },
  
  getNewsletterSignupConfirmationEmailSubject: function () {
    return this.config.newslettersignup.confirmationEmail.subject;
  },
};
