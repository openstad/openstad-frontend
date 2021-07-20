const config = require('config');
const mail = require('../lib/mail');

let Notifications = {
	queue: {},
};

Notifications.addToQueue = function(data) {

	let self = this;

	if (!data.type || !data.instanceId) return;

	self.queue[data.type] = self.queue[data.type] || {};
	self.queue[data.type][data.siteId] = self.queue[data.type][data.siteId] || [];
	
	self.queue[data.type][data.siteId].push(data);


}

Notifications.processQueue = function(type) {

	let self = this;
  
	if (self.queue[type]) {

		Object.keys(self.queue[type]).forEach((siteId) => {

			if (self.queue[type][siteId] && self.queue[type][siteId].length) {

				switch(type) {
					case 'argument':
						self.sendMessage(siteId, 'argument', 'create', self.queue[type][siteId])
						break;

					case 'idea':
						self.queue[type][siteId].forEach((entry) => {
							self.sendMessage(siteId, 'idea', entry.action, [entry] );
						});
						break;

					case 'article':
						self.queue[type][siteId].forEach((entry) => {
							self.sendMessage(siteId, 'article', entry.action, [entry] );
						});
						break;
						
					default: 
				}

				self.queue[type][siteId] = [];

			}

		});

	}

}

Notifications.sendMessage = function(siteId, type, action, data) {

	const db = require('../db'); // looped required

	let self = this;

	// get config
	db.Site.findByPk(siteId)
		.then(site => {

      
			let myConfig = Object.assign({}, config, site && site.config);

			let maildata = {};

			maildata.subject = type == 'argument' ? 'Nieuwe argumenten geplaatst' : ( action == 'create' ? 'Nieuwe inzending geplaatst' : 'Bestaande inzending bewerkt' );

			maildata.from = ( myConfig.notifications && ( myConfig.notifications.from || ( myConfig.notifications.admin && myConfig.notifications.admin.emailAddress ) ) ) || myConfig.mail.from; // backwards compatible
			maildata.to = ( myConfig.notifications && myConfig.notifications.to ) || maildata.from;

			maildata.EMAIL = maildata.from;
			maildata.HOSTNAME = ( myConfig.cms && ( myConfig.cms.hostname || myConfig.cms.domain ) ) || myConfig.hostname || myConfig.domain;
			maildata.URL = ( myConfig.cms && myConfig.cms.url ) || myConfig.url || ( 'https://' + maildata.HOSTNAME );
			maildata.SITENAME = ( site && site.title ) || myConfig.siteName;

			maildata.subject += ' op ' + maildata.SITENAME;

			maildata.template = myConfig.notifications && myConfig.notifications.template;

			let instanceIds = data.map( entry => entry.instanceId );
			let model = type.charAt(0).toUpperCase() + type.slice(1);

			let scope = type == 'idea' || type == 'article' ? ['withUser'] : ['withUser', 'withIdea'];
			db[model].scope(scope).findAll({ where: { id: instanceIds }})
				.then( found => {
					maildata.data = {};
					maildata.data[type] = found.map( entry => {
						let json = entry.toJSON();
						if ( type == 'idea' ) {
							let inzendingPath = ( myConfig.ideas && myConfig.ideas.feedbackEmail && myConfig.ideas.feedbackEmail.inzendingPath && myConfig.ideas.feedbackEmail.inzendingPath.replace(/\[\[ideaId\]\]/, entry.id) ) || "/";
							json.inzendingURL = maildata.URL + inzendingPath;
						}
						if ( type == 'article' ) {
							let inzendingPath = ( myConfig.articles && myConfig.articles.feedbackEmail && myConfig.articles.feedbackEmail.inzendingPath && myConfig.articles.feedbackEmail.inzendingPath.replace(/\[\[articleId\]\]/, entry.id) ) || "/";
							json.inzendingURL = maildata.URL + inzendingPath;
						}
						return json;
					});
					mail.sendNotificationMail(maildata, site);
				});

		})

}

module.exports = Notifications;
