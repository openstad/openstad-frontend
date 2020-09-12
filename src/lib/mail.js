const config     = require('config');
const nodemailer = require('nodemailer');
const Promise    = require('bluebird');
const merge = require('merge');
const htmlToText   = require('html-to-text');

const debug      = require('debug');
const log        = debug('app:mail:sent');
const logError   = debug('app:mail:error');

const method     = config.get('mail.method');
const transport  = config.get('mail.transport');

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

let transporter;
switch ( method ) {
  case 'smtp':
    transporter = nodemailer.createTransport(transport.smtp);
    break;
  case 'sendgrid':
    var sendGrid = require('nodemailer-sendgrid-transport');
    var sgConfig = sendGrid(transport.sendgrid);
    transporter  = nodemailer.createTransport(sgConfig);
    break;
}

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

  transporter.sendMail(
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
  data.logo = getLogoForSite(null);

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
		attachments : getDefaultAttachments(data.logo)
	});
};

// send email to user that submitted an idea
function sendThankYouMail (resource, user, site) {
  let resourceType;
  let match = resource.toString().match(/SequelizeInstance:([a-z]+)/);
  if (match) resourceType = match[1];

  if (!resourceType) return console.log('sendThankYouMail error: resourceType not found');

  let resourceTypeSiteConfig = site && site.config && site.config[`${resourceType}s`] || {};
  let resourceTypeApiConfig = config && config[`${resourceType}s`] || {};
  let resourceTypeConfig = merge.recursive({}, resourceTypeApiConfig, resourceTypeSiteConfig);

  let url = ( site && site.config.cms && site.config.cms.url ) || ( config && config.url );
  let hostname = ( site && site.config.cms && site.config.cms.hostname ) || ( config && config.hostname );
  let sitename = ( site && site.title ) || ( config && config.get('siteName') );
  let fromAddress = (resourceTypeConfig.feedbackEmail && resourceTypeConfig.feedbackEmail.from) || config.email || ( config.mail && config.mail.from ) || 'unknown@no.where';
  if ( fromAddress && fromAddress.match(/^.+<(.+)>$/, '$1') ) fromAddress = fromAddress.replace(/^.+<(.+)>$/, '$1');

	let inzendingPath = ( resourceTypeConfig.feedbackEmail && resourceTypeConfig.feedbackEmail.inzendingPath && resourceTypeConfig.feedbackEmail.inzendingPath.replace(/\[\[ideaId\]\]/, resource.id) ) || "/" ;
	inzendingPath = inzendingPath.replace(/\[\[articleId\]\]/, resource.id);
	let inzendingURL = url + inzendingPath;
  const logo =  getLogoForSite(site)

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
	let template = resourceTypeConfig.feedbackEmail && resourceTypeConfig.feedbackEmail.template;

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

  let attachments = ( resourceTypeConfig.feedbackEmail && resourceTypeConfig.feedbackEmail.attachments ) || getDefaultAttachments(logo);

  try {
  sendMail({
    to: user.email,
    from: fromAddress,
    subject: (resourceTypeConfig.feedbackEmail && resourceTypeConfig.feedbackEmail.subject) || 'Bedankt voor je inzending',
    html: html,
    text: text,
    attachments,
  });
  } catch(err) {
    console.log(err);
  }

}

function getDefaultAttachments(logo) {
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

function getLogoForSite (site) {
  const clientConfigStyling = site && site.config && site.config.styling ? site.config.styling : {};

  let logo;

  if (process.env.LOGO) {
    logo = process.env.LOGO;
  }

  if (clientConfigStyling && clientConfigStyling.logo) {
    logo = clientConfigStyling.logo;
  }

  return logo;
}

// send email to user that submitted an idea
function sendNewsletterSignupConfirmationMail( newslettersignup, user, site ) {


  let url = ( site && site.config.cms && site.config.cms.url ) || ( config && config.url );
  let hostname = ( site && site.config.cms && site.config.cms.hostname ) || ( config && config.hostname );
  let sitename = ( site && site.title ) || ( config && config.get('siteName') );
  let fromAddress = (site && site.config && site.config.ideas && site.config.ideas.feedbackEmail && site.config.ideas.feedbackEmail.from) || ( config.ideas && config.ideas.feedbackEmail && config.ideas.feedbackEmail.from ) || config.email;
  if ( fromAddress.match(/^.+<(.+)>$/, '$1') ) fromAddress = fromAddress.replace(/^.+<(.+)>$/, '$1');

	let confirmationUrl = site && site.config && site.config.newslettersignup && site.config.newslettersignup.confirmationEmail && site.config.newslettersignup.confirmationEmail.url;
	confirmationUrl = confirmationUrl.replace(/\[\[token\]\]/, newslettersignup.confirmToken)
  const logo = getLogoForSite(site);

  let data = {
    date: new Date(),
    user: user,
    HOSTNAME: hostname,
    SITENAME: sitename,
		confirmationUrl,
    URL: url,
    EMAIL: fromAddress,
    logo:logo
  };

	let html;
	let template = site && site.config && site.config.newslettersignup && site.config.newslettersignup.confirmationEmail && site.config.newslettersignup.confirmationEmail.template;
	if (template) {
		html = nunjucks.renderString(template, data);
	} else {
		html = nunjucks.render('confirm_newsletter_signup.njk', data);
	}

  let text = htmlToText.fromString(html, {
    ignoreImage: true,
    hideLinkHrefIfSameAsText: true,
    uppercaseHeadings: false
  });

  let attachments = ( site && site.config && site.config.newslettersignup && site.config.newslettersignup.confirmationEmail && site.config.newslettersignup.confirmationEmail.attachments ) || ( config.ideas && config.ideas.feedbackEmail && config.ideas.feedbackEmail.attachments )  || getDefaultAttachments(logo);

  sendMail({
    to: newslettersignup.email,
    from: fromAddress,
    subject: (site && site.config && site.config.newslettersignup && site.config.newslettersignup.confirmationEmail && site.config.newslettersignup.confirmationEmail.subject) || ( config.ideas && config.ideas.feedbackEmail && config.ideas.feedbackEmail.subject ) || 'Bedankt voor je aanmelding',
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
