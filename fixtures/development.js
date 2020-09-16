const co = require('co');
const moment = require('moment-timezone')
const log = require('debug')('app:db');

const randomString = (length) => {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

const removeProtocol = (url) => {
  return url ? url.replace('http://', '').replace('https://', '').replace(/\/$/, "") : '';
}

const removeWww = (url) => {
  return url ? url.replace('www.', '') : '';
}


const ensureProtocol = (url) => {
	if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    	url = "https://" + url;
	}
	return url;
}

module.exports = co.wrap(function*( db ) {

	log('--> Creating sites');

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


/**
 * In development setups allow redirect to localhost
 * @type {[type]}
 */
const allowedDomains = process.env.NODE_ENV === 'development' ? ['localhost'] : [];
allowedDomains.push(removeProtocol(process.env.ADMIN_URL));
allowedDomains.push(removeWww(removeProtocol(process.env.FRONTEND_URL)));

var sites = [
	{id: 1, name: 'site-one', domain: removeProtocol(process.env.ADMIN_URL), title: 'OpenStad Admin ', config: {
		oauth: {
			default: {
				'auth-server-url': process.env.AUTH_URL,
				'auth-client-secret':process.env.AUTH_ADMIN_CLIENT_SECRET,
				'auth-client-id': process.env.AUTH_ADMIN_CLIENT_ID,
				'auth-internal-server-url':process.env.AUTH_INTERNAL_SERVER_URL
			}
		},
		allowedDomains:allowedDomains
	}},
	{id: 2, name: 'site-one', domain: removeWww(removeProtocol(process.env.FRONTEND_URL)), title: 'OpenStad Default Site', config: {
    cms: {
        "url": ensureProtocol(process.env.FRONTEND_URL),
        "dbName": process.env.DEFAULT_DB ? process.env.DEFAULT_DB : "default_db",
        "hostname": removeProtocol(process.env.FRONTEND_URL)
    },
		oauth: {
			default: {
				'auth-server-url': process.env.AUTH_URL,
				'auth-client-secret':process.env.AUTH_FIRST_CLIENT_SECRET,
				'auth-client-id': process.env.AUTH_FIRST_CLIENT_ID,
				'auth-internal-server-url':process.env.AUTH_INTERNAL_SERVER_URL
			}
		},
    allowedDomains: allowedDomains
	}},
];

console.log(sites);
console.log(sites[0].config.oauth);
console.log(sites[1].config.oauth);

var users = [
	//fixed user for SITE and Admin to get admin right
	{
    id: process.env.AUTH_FIXED_USER_ID ? process.env.AUTH_FIXED_USER_ID : 2,
    siteId: 1,
    complete: true,
    role: 'admin',
    email: 'admin@openstad.org',
    password: randomString(10),
    firstName: 'Administrator',
    lastName: '',

	//Add one dummy Idea for fun
	ideas : [
		{
			id               : 2,
			siteId           : 2,
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
