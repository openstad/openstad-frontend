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
	// console.log(JSON.stringify(data, null, 2));

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
		attachments : ['logo.png']
	});
};

// send email to user that submitted an idea
function sendThankYouMail(idea, user) {
  
  const url         = siteConfig.getCmsUrl();
  const hostname    = siteConfig.getCmsHostname();
  const sitename    = siteConfig.getTitle();
  let fromAddress = siteConfig.getIdeasFeedbackEmailFrom() || config.email;
  if (fromAddress.match(/^.+<(.+)>$/, '$1')) fromAddress = fromAddress.replace(/^.+<(.+)>$/, '$1');
  
  const inzendingPath = (siteConfig.getIdeasFeedbackEmailInzendingPath() && siteConfig.getIdeasFeedbackEmailInzendingPath().replace(/\[\[ideaId\]\]/, idea.id)) || "/";
  const inzendingURL  = url + inzendingPath;
  
  let data = {
    date:     new Date(),
    user:     user,
    idea:     idea,
    HOSTNAME: hostname,
    SITENAME: sitename,
    inzendingURL,
    URL:      url,
    EMAIL:    fromAddress
  };
  
  let html;
  const template = siteConfig.getIdeasFeedbackEmailTemplate();
  if (template) {
    html = nunjucks.renderString(template, data);
  } else {
    html = nunjucks.render('idea_created.njk', data);
  }
  
  const text = htmlToText.fromString(html, {
    ignoreImage:              true,
    hideLinkHrefIfSameAsText: true,
    uppercaseHeadings:        false
  });
  
  const attachments = siteConfig.getIdeasFeedbackEmailAttachments();
  
  sendMail({
             to:      user.email,
             from:    fromAddress,
             subject: siteConfig.getIdeasFeedbackEmailSubject() || 'Bedankt voor je inzending',
             html:    html,
             text:    text,
             attachments,
           });
  
}

// send email to user that submitted an idea
function sendNewsletterSignupConfirmationMail( newslettersignup, user ) {

  const url         = siteConfig.getCmsUrl();
  const hostname    = siteConfig.getCmsHostname();
  const sitename    = siteConfig.getTitle();
  let fromAddress = siteConfig.getIdeasFeedbackEmailFrom() || config.email;
  if ( fromAddress.match(/^.+<(.+)>$/, '$1') ) fromAddress = fromAddress.replace(/^.+<(.+)>$/, '$1');

	const confirmationUrl = siteConfig.getNewsletterSignupConfirmationEmailUrl().replace(/\[\[token\]\]/, newslettersignup.confirmToken)

  const data    = {
    date: new Date(),
    user: user,
    HOSTNAME: hostname,
    SITENAME: sitename,
		confirmationUrl,
    URL: url,
    EMAIL: fromAddress,
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

  const attachments = siteConfig.getNewsletterSignupConfirmationEmailAttachments() || [{
		filename : 'logo.png',
		path     : 'email/img/logo.png',
		cid      : 'logo'
  }];

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

