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

	// TODO: site config; dat moet iets inteligenter. Site moet misschien sowieso toegevoegd.
	let adminEmail = config.notifications && config.notifications.admin && config.notifications.admin.emailAddress;
	let siteName = config.siteName;
	let subject = data.assets.arg ? 'Nieuwe argumenten geplaatst' : 'Nieuw idee geplaatst';

	if (adminEmail) {
		sendMail({
			to          : adminEmail,
			subject     : subject,
			html        : nunjucks.render('notifications_admin.njk', data),
			text        : `Er hebben recent activiteiten plaatsgevonden op ${siteName} die mogelijk voor jou interessant zijn!`,
			attachments : [{
				filename : 'logo@2x.png',
				path     : 'email/img/logo@2x.png',
				cid      : 'logo'
			}]
		});
	}

};

// send email to user that submitted an idea
function sendThankYouMail( idea, user, site ) {

  let url = ( site && site.config.cms && site.config.cms.url ) || ( config && config.url );
  let hostname = ( site && site.config.cms && site.config.cms.hostname ) || ( config && config.hostname );

  let data    = {
    date: new Date(),
    user: user,
    idea: idea,
    HOSTNAME: hostname,
    URL: url,
  };

  let html = nunjucks.render('idea_created.njk', data);
  let text = htmlToText.fromString(html, {
    ignoreImage: true,
    hideLinkHrefIfSameAsText: true,
    uppercaseHeadings: false
  });

  let attachments = ( site && site.config && site.config.ideas && site.config.ideas.feedbackEmail && site.config.ideas.feedbackEmail.attachments ) || ( config.ideas && config.ideas.feedbackEmail && config.ideas.feedbackEmail.attachments )  || [{
    filename: 'logo.png',
		path: 'email/img/logo@2x.png',
    cid: 'logo'
  }];

  sendMail({
    to: user.email,
    from: (site && site.config && site.config.ideas && site.config.ideas.feedbackEmail && site.config.ideas.feedbackEmail.from) || ( config.ideas && config.ideas.feedbackEmail && config.ideas.feedbackEmail.from ) || config.email,
    subject: (site && site.config && site.config.ideas && site.config.ideas.feedbackEmail && site.config.ideas.feedbackEmail.subject) || ( config.ideas && config.ideas.feedbackEmail && config.ideas.feedbackEmail.subject ) || 'Bedankt voor je voorstel',
    html: html,
    text: text,
    attachments: attachments,
  });

}

module.exports = {
  sendMail,
	sendNotificationMail,
  sendThankYouMail,
};

