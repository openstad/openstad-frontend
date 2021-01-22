const config     = require('config');
const nodemailer = require('nodemailer');
const Promise    = require('bluebird');
const merge = require('merge');
const htmlToText   = require('html-to-text');
const siteConfig = require('./siteConfig');
const mailTransporter = require('./mailTransporter');

const debug      = require('debug');
const log        = debug('app:mail:sent');
const logError   = debug('app:mail:error');

// nunjucks is used when sending emails
var nunjucks = require('nunjucks');
var moment       = require('moment-timezone');
var env = nunjucks.configure('email');

var dateFilter   = require('../lib/nunjucks-date-filter');
dateFilter.setDefaultFormat('DD-MM-YYYY HH:mm');
env.addFilter('date', dateFilter);
//env.addFilter('duration', duration);

// Global variables.
env.addGlobal('HOSTNAME', config.get('hostname'));
env.addGlobal('SITENAME', config.get('siteName'));
//env.addGlobal('PAGENAME_POSTFIX', config.get('pageNamePostfix'));
env.addGlobal('EMAIL', config.get('emailAddress'));

env.addGlobal('GLOBALS', config.get('express.rendering.globals'));

env.addGlobal('config', config)

// Default options for a single email.
let defaultSendMailOptions = {
  from: config.get('mail.from'),
  subject: 'No title',
  text: 'No message'
};

// generic send mail function
function sendMail( options ) {

  if ( options.attachments ) {
    options.attachments.forEach((entry, index) => {
      options.attachments[index] = {
		    filename : entry,
		    path     : 'email/uploads/' + entry,
		    cid      : entry
      }
    });
  }

  mailTransporter.getTransporter().sendMail(
    merge(defaultSendMailOptions, options),
    function( error, info ) {
      if ( error ) {
        logError(error.message);
      } else {
        log(info.response);
      }
    }
  );
}

function sendNotificationMail( data ) {
  //site is not present so will fallback to defaults
  //Email also has a fallback if all is empty
  data.logo = siteConfig.getLogo();

	let html;
	if (data.template) {
		html = nunjucks.renderString(data.template, data)
	} else {
		html = nunjucks.render('notifications_admin.njk', data)
	}

	sendMail({
		to          : data.to,
		from        : data.from,
		subject     : data.subject,
		html        : html,
		text        : `Er hebben recent activiteiten plaatsgevonden op ${data.SITENAME} die mogelijk voor jou interessant zijn!`,
		attachments : siteConfig.getDefaultEmailAttachments()
	});
};

// send email to user that submitted a resource
function sendThankYouMail (resource, resourceType, user) {
  
  if (!resourceType) return console.error('sendThankYouMail error: resourceType not provided');
  
  const url         = siteConfig.getCmsUrl();
  const hostname    = siteConfig.getCmsHostname();
  const sitename    = siteConfig.getTitle();
  let fromAddress = siteConfig.getFeedbackEmailFrom(resourceType) || config.email;
  if (fromAddress.match(/^.+<(.+)>$/, '$1')) fromAddress = fromAddress.replace(/^.+<(.+)>$/, '$1');

  // todo: als je dan toch met een siteConfig.get werkt, moet deze search-and-replace dan niet ook daar?
  let idRegex = new RegExp(`\\[\\[(?:${resourceType}|idea)?Id\\]\\]`, 'g'); // 'idea' wegens backward compatible
  const inzendingPath = (siteConfig.getFeedbackEmailInzendingPath(resourceType) && siteConfig.getFeedbackEmailInzendingPath(resourceType).replace(idRegex, resource.id).replace(/\[\[resourceType\]\]/, resourceType)) || "/";
  const inzendingURL  = url + inzendingPath;
  const logo =  siteConfig.getLogo();
  
  let data    = {
    date: new Date(),
    user: user,
    idea: resource,
    article: resource,
    HOSTNAME: hostname,
    SITENAME: sitename,
		inzendingURL,
    URL: url,
    EMAIL: fromAddress,
    logo: logo
  };

	let html;
	let template = siteConfig.getResourceFeedbackEmailTemplate(resourceType);
	
	if (template) {
    /**
     * This is for legacy reasons
     * if contains <html> we assume it doesn't need a layout wrapper then render as a string
     * if not included then include by rendering the string and then rendering a blanco
     * the layout by calling the blanco template
     */
    if (template.includes("<html>")) {
      html  = nunjucks.renderString(template, data)
    } else {
      html = nunjucks.render('blanco.njk', Object.assign(data, {
        message: nunjucks.renderString(template, data)
      }));
    }
	} else {
		html = nunjucks.render(`${resourceType}_created.njk`, data);
	}

  let text = htmlToText.fromString(html, {
    ignoreImage: true,
    hideLinkHrefIfSameAsText: true,
    uppercaseHeadings: false
  });

  let attachments = siteConfig.getResourceFeedbackEmailAttachments(resourceType) || siteConfig.getDefaultEmailAttachments();
  
  try {
  sendMail({
    // in some cases the resource, like order or account has a different email from the submitted user, default to resource, otherwise send to owner of resource
    to: resource.email ?  resource.email : user.email,
    from: fromAddress,
    subject: siteConfig.getResourceFeedbackEmailSubject(resourceType) || 'Bedankt voor je inzending',
    html: html,
    text: text,
    attachments,
  });
  } catch(err) {
    console.log(err);
  }

}

// send email to user that submitted a NewsletterSignup
function sendNewsletterSignupConfirmationMail( newslettersignup, user ) {

  const url         = siteConfig.getCmsUrl();
  const hostname    = siteConfig.getCmsHostname();
  const sitename    = siteConfig.getTitle();
  let fromAddress = siteConfig.getFeedbackEmailFrom() || config.email;
  if ( fromAddress.match(/^.+<(.+)>$/, '$1') ) fromAddress = fromAddress.replace(/^.+<(.+)>$/, '$1');

	const confirmationUrl = siteConfig.getNewsletterSignupConfirmationEmailUrl().replace(/\[\[token\]\]/, newslettersignup.confirmToken)
  const logo = siteConfig.getLogo();

  const data    = {
    date: new Date(),
    user: user,
    HOSTNAME: hostname,
    SITENAME: sitename,
		confirmationUrl,
    URL: url,
    EMAIL: fromAddress,
    logo: logo
  };

	let html;
	let template = siteConfig.getNewsletterSignupConfirmationEmailTemplate();
	if (template) {
		html = nunjucks.renderString(template, data);
	} else {
		html = nunjucks.render('confirm_newsletter_signup.njk', data);
	}

  const text = htmlToText.fromString(html, {
    ignoreImage: true,
    hideLinkHrefIfSameAsText: true,
    uppercaseHeadings: false
  });

  const attachments = siteConfig.getNewsletterSignupConfirmationEmailAttachments();

  sendMail({
    to: newslettersignup.email,
    from: fromAddress,
    subject: siteConfig.getNewsletterSignupConfirmationEmailSubject() || 'Bedankt voor je aanmelding',
    html: html,
    text: text,
    attachments,
  });

}

module.exports = {
  sendMail,
	sendNotificationMail,
  sendThankYouMail,
	sendNewsletterSignupConfirmationMail,
};
