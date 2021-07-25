const merge             = require('merge');
const config            = require('config');
const defaultSiteConfig = require('./defaultSiteConfig');

class MailConfig {

  constructor(site) {

    let self = this;
    self.config = merge.recursive(true, defaultSiteConfig, config || {});
    
    // Exceptions from local config because field names don't match
    self.config.cms.url = self.config.url || self.config.title;
    self.config.cms.hostname = self.config.hostname || self.config.title;
    self.config.title = self.config.siteName || self.config.title;
    self.config.newslettersignup.confirmationEmail.attachments = (self.config.ideas && self.config.ideas.feedbackEmail && self.config.ideas.feedbackEmail.attachments) || self.config.newslettersignup.confirmationEmail.attachments;
    self.config.newslettersignup.confirmationEmail.subject = (self.config.ideas && self.config.ideas.feedbackEmail && self.config.ideas.feedbackEmail.subject) || self.config.newslettersignup.confirmationEmail.subject;
    
    self.config = merge.recursive(self.config, site.config || {});
    
    // Put the title in the config as well
    self.config.title = site.title || self.config.title;

    return self;

  }
  
  getTitle() {
    return this.config.title;
  }
  
  getCmsUrl() {
    return this.config.cms.url;
  }
  
  getCmsHostname() {
    return this.config.cms.hostname;
  }
  
  getResourceConfig(resourceType) {
    return this.config[resourceType] || {};
  }

  getResourceFeedbackEmail(resourceType) {
    return this.getResourceConfig(resourceType).feedbackEmail || {};
  }

  getFeedbackEmailFrom(resourceType) {
    resourceType = resourceType || 'ideas'
    return this.getResourceFeedbackEmail(resourceType).from;
  }
  
  getFeedbackEmailInzendingPath(resourceType) {
    return this.getResourceFeedbackEmail(resourceType).inzendingPath;
  }
  
  getResourceFeedbackEmailTemplate(resourceType) {
    return this.getResourceFeedbackEmail(resourceType).template;
  }
  
  getResourceFeedbackEmailAttachments(resourceType) {
    return this.getResourceFeedbackEmail(resourceType).attachments;
  }
  
  getResourceFeedbackEmailSubject(resourceType) {
    return this.getResourceFeedbackEmail(resourceType).subject;
  }
  
  getMailMethod() {
    return this.config.mail.method;
  }
  
  getMailTransport() {
    return this.config.mail.transport[this.getMailMethod()];
  }
  
  getNewsletterSignupConfirmationEmailUrl() {
    return this.config.newslettersignup.confirmationEmail.url;
  }
  
  getNewsletterSignupConfirmationEmailTemplate() {
    return this.config.newslettersignup.confirmationEmail.template;
  }
  
  getNewsletterSignupConfirmationEmailAttachments() {
    return this.config.newslettersignup.confirmationEmail.attachments || this.getDefaultEmailAttachments();
  }
  
  getNewsletterSignupConfirmationEmailSubject() {
    return this.config.newslettersignup.confirmationEmail.subject;
  }
  
  getLogo() {
    let logo = this.config.styling.logo;
    
    if (process.env.LOGO) {
      logo = process.env.LOGO;
    }
    
    return logo;
  }
  
  getDefaultEmailAttachments() {
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

module.exports = MailConfig;
