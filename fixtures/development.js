const co = require('co');
const moment = require('moment-timezone')
const log = require('debug')('app:db');

module.exports = co.wrap(function*( db ) {

	log('Creating sites');

	yield sites.map(function( siteData ) {
		return db.Site.create(siteData);
	});

	log('Creating users');
	yield users.map(function( userData ) {
		return db.User.create(userData, {
			include  : [{
				model: db.Idea,
				include: [{
					model : db.Argument,
					as    : 'argumentsAgainst'
				}, {
					model : db.Argument,
					as    : 'argumentsFor'
				}, {
					model: db.Vote
				}]
			}]
		});
	});

	log('test database complete');

})

var today = moment().endOf('day');

var sites = [
	{id: 1, name: 'site-one', domain: process.env.ADMIN_DOMAIN, title: 'OpenStad Admin ', config: {
		oauth: {
			default: {
				'auth-server-url': process.env.AUTH_URL,
				'auth-client-secret':process.env.AUTH_FIRST_CLIENT_SECRET,
				'auth-client-id': process.env.AUTH_FIRST_CLIENT_ID,
				'auth-internal-server-url':process.env.AUTH_INTERNAL_SERVER_URL
			}
		},
		allowedDomains: [
			process.env.DEV_SITE_DOMAIN,
			//do not allow to redirect to localhost in production!
			'localhost'
		]
	}},
	{id: 2, name: 'site-one', domain: process.env.DEV_SITE_DOMAIN, title: 'OpenStad Development Site', config: {
		oauth: {
			default: {
				'auth-server-url': process.env.AUTH_URL,
				'auth-client-secret':process.env.AUTH_FIRST_CLIENT_SECRET,
				'auth-client-id': process.env.AUTH_FIRST_CLIENT_ID,
				'auth-internal-server-url':process.env.AUTH_INTERNAL_SERVER_URL
			}
		},
		allowedDomains: [
			process.env.DEV_SITE_DOMAIN,
			//do not allow to redirect to localhost in production!
			'localhost'
		]
	}},
];

var users = [
	{id: 2, complete: true, role: 'admin', email: 'admin@undefined.nl', password: '123456', firstName: 'Administrator', lastName: 'on develoment', ideas : [
		{
			id               : 1,
			siteId           : 1,
			startDate        : moment(today).subtract(1, 'days'),
			title            : 'Metro naar stadsdeel West',
			summary          : 'Een nieuwe metrobuis naar het Bos en Lommerplein om sneller thuis te zijn.',
			description      : 'Ik moet nu een half uur fietsen, dat vind ik veel te lang. Helemaal bezweet op m\'n werk aankomen elke dag is echt geen doen; ik wil een extra metrobuis!',
			location         : {type: 'Point', coordinates: [52.3779893, 4.8460973]},
			argumentsAgainst : [
				{userId: 2, sentiment: 'against' , description: 'De kosten van dit idee zullen veel te hoog zijn. Daarnaast zal dit project ook weer enorm uit de hand lopen waarschijnlijk, net zoals de vorige metro.'}
			],
			argumentsFor     : [
				{userId: 2  , sentiment: 'for'    , description: 'De metro is cool. Als ik iets mooi vind is het in mn leren jekkie en mn zonnebril op in zon zilveren ding stappen, echt geweldig. En de mensen maar denken, "waar komt die strakke vogel vandaan?"'},
			],
			votes: [
				{userId: 2  , opinion: 'yes'},
			]
		}]},
];
