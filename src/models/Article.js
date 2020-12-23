var Sequelize = require('sequelize');
var co        = require('co')
  , config        = require('config')
  , moment        = require('moment-timezone')
  , pick          = require('lodash/pick')
  , Promise       = require('bluebird');

var sanitize      = require('../util/sanitize');
// var ImageOptim    = require('../ImageOptim');
var notifications = require('../notifications');

const merge = require('merge');
const userHasRole = require('../lib/sequelize-authorization/lib/hasRole');
const getExtraDataConfig = require('../lib/sequelize-authorization/lib/getExtraDataConfig');

module.exports = function( db, sequelize, DataTypes ) {

	var Article = sequelize.define('article', {

		siteId: {
			type         : DataTypes.INTEGER,
			defaultValue : config.siteId && typeof config.siteId == 'number' ? config.siteId : 0,
		},

		userId: {
			type         : DataTypes.INTEGER,
			allowNull    : false,
			defaultValue: 0,
		},

		startDate: {
			type         : DataTypes.DATE,
			allowNull    : false
		},

		startDateHumanized: {
			type         : DataTypes.VIRTUAL,
			get          : function() {
				var date = this.getDataValue('startDate');
				try {
					if( !date )
						return 'Onbekende datum';
					return  moment(date).format('LLL');
				} catch( error ) {
					return (error.message || 'dateFilter error').toString()
				}
			}
		},

		endDate: {
			type         : DataTypes.DATE,
			allowNull    : true,
			get          : function() {
				var date = this.getDataValue('endDate');
      },
		},

		endDateHumanized: {
			type         : DataTypes.VIRTUAL,
			get          : function() {
				var date = this.getDataValue('endDate');
				try {
					if( !date )
						return 'Onbekende datum';
					return  moment(date).format('LLL');
				} catch( error ) {
					return (error.message || 'dateFilter error').toString()
				}
			}
		},

		duration: {
			type         : DataTypes.VIRTUAL,
			get          : function() {
				if( this.getDataValue('status') != 'OPEN' ) {
					return 0;
				}

				var now     = moment();
				var endDate = this.getDataValue('endDate');
				return Math.max(0, moment(endDate).diff(Date.now()));
			}
		},

		sort: {
			type         : DataTypes.INTEGER,
			allowNull    : false,
			defaultValue : 1
		},

		status: {
			type         : DataTypes.ENUM('OPEN','CLOSED','ACCEPTED','DENIED','BUSY','DONE'),
			defaultValue : 'OPEN',
			allowNull    : false
		},

		title: {
			type         : DataTypes.STRING(255),
			allowNull    : false,
			validate     : {
				textLength(value) {
				 	let len = sanitize.title(value.trim()).length;
					let titleMinLength = ( this.config && this.config.articles && this.config.articles.titleMinLength || 10 )
					let titleMaxLength = ( this.config && this.config.articles && this.config.articles.titleMaxLength || 50 )
					if (len < titleMinLength || len > titleMaxLength)
					throw new Error(`Titel moet tussen ${titleMinLength} en ${titleMaxLength} tekens zijn`);
				}
			},
			set          : function( text ) {
				this.setDataValue('title', sanitize.title(text.trim()));
			}
		},

		posterImageUrl: {
			type         : DataTypes.VIRTUAL,
			get          : function() {
				var posterImage = this.get('posterImage');
				var location    = this.get('location');

				if ( Array.isArray(posterImage) ) {
					posterImage = posterImage[0];
				}

				// temp, want binnenkort hebben we een goed systeem voor images
				let imageUrl = config.url || '';

				return posterImage ? `${imageUrl}/image/${posterImage.key}?thumb` :
				       location    ? 'https://maps.googleapis.com/maps/api/streetview?'+
				                     'size=800x600&'+
				                     `location=${location.coordinates[0]},${location.coordinates[1]}&`+
				                     'heading=151.78&pitch=-0.76&key=' + config.openStadMap.googleKey
				                   : null;
			}
		},

		summary: {
			type         : DataTypes.TEXT,
			allowNull    : false,
			validate     : {
				textLength(value) {
				 	let len = sanitize.summary(value.trim()).length;
					let summaryMinLength = ( this.config && this.config.articles && this.config.articles.summaryMinLength || 20 )
					let summaryMaxLength = ( this.config && this.config.articles && this.config.articles.summaryMaxLength || 140 )
					if (len < summaryMinLength || len > summaryMaxLength)
					throw new Error(`Samenvatting moet tussen ${summaryMinLength} en ${summaryMaxLength} tekens zijn`);
				}
			},
			set          : function( text ) {
				this.setDataValue('summary', sanitize.summary(text.trim()));
			}
		},

		description: {
			type         : DataTypes.TEXT,
			allowNull    : false,
			validate     : {
				textLength(value) {
				 	let len = sanitize.summary(value.trim()).length;
					let descriptionMinLength = ( this.config && this.config.articles && this.config.articles.descriptionMinLength || 140 )
					let descriptionMaxLength = ( this.config && this.config.articles && this.config.articles.descriptionMaxLength || 5000 )
					if (len < descriptionMinLength || len > descriptionMaxLength)
					throw new Error(`Beschrijving moet tussen ${descriptionMinLength} en ${descriptionMaxLength} tekens zijn`);
				}
			},
			set          : function( text ) {
				this.setDataValue('description', sanitize.content(text.trim()));
			}
		},

    extraData: getExtraDataConfig(DataTypes.JSON,  'ideas'),

		location: {
			type         : DataTypes.GEOMETRY('POINT'),
			allowNull    : !(config.articles && config.articles.location && config.articles.location.isMandatory),
		},

		position: {
			type         : DataTypes.VIRTUAL,
			get          : function() {
				var location    = this.get('location');
				var position;
				if (location && location.type && location.type == 'Point') {
					position = {
						lat: location.coordinates[0],
						lng: location.coordinates[1],
					};
				}
				return position
			}
		},

		modBreak: {
			type         : DataTypes.TEXT,
			allowNull    : true,
			set          : function( text ) {
				this.setDataValue('modBreak', sanitize.content(text));
			}
		},

		modBreakUserId: {
			type         : DataTypes.INTEGER,
			allowNull    : true
		},

		modBreakDate: {
			type         : DataTypes.DATE,
			allowNull    : true
		},

		modBreakDateHumanized: {
			type         : DataTypes.VIRTUAL,
			get          : function() {
				var date = this.getDataValue('modBreakDate');
				try {
					if( !date )
						return undefined;
					return  moment(date).format('LLL');
				} catch( error ) {
					return (error.message || 'dateFilter error').toString()
				}
			}
		},

		createDateHumanized: {
			type         : DataTypes.VIRTUAL,
			get          : function() {
				var date = this.getDataValue('createdAt');
				try {
					if( !date )
						return 'Onbekende datum';
					return  moment(date).format('LLL');
				} catch( error ) {
					return (error.message || 'dateFilter error').toString()
				}
			}
		},

	}, {

		hooks: {

      // onderstaand is een workaround: bij een delete wordt wel de vvalidatehook aangeroepen, maar niet de beforeValidate hook. Dat lijkt een bug.
			beforeValidate: beforeValidateHook,
      beforeDestroy: beforeValidateHook,

			afterCreate: function(instance, options) {
				notifications.addToQueue({ type: 'article', action: 'create', siteId: instance.siteId, instanceId: instance.id });
				// TODO: wat te doen met images
				// article.updateImages(imageKeys, data.imageExtraData);
			},

			afterUpdate: function(instance, options) {
				notifications.addToQueue({ type: 'article', action: 'update', siteId: instance.siteId, instanceId: instance.id });
				// TODO: wat te doen met images
				// article.updateImages(imageKeys, data.imageExtraData);
			},

		},

		individualHooks: true,

		validate: {
			validDeadline: function() {
				if( this.endDate - this.startDate < 43200000 ) {
					throw Error('An article must run at least 1 day');
				}
			},
			validExtraData: function(next) {

        let self = this;
				let errors = [];
				let value = self.extraData || {}
        let validated = {};

				let configExtraData = self.config && self.config.articles && self.config.articles.extraData;

        function checkValue(value, config) {

				  if (config) {

            let key;
					  Object.keys(config).forEach((key) => {

              let error = false;

              // recursion on sub objects
              if (typeof value[key] == 'object' && config[key].type == 'object') {
                if (config[key].subset) {
                  checkValue(value[key], config[key].subset);
                } else {
                  errors.push(`Configuration for ${key} is incomplete`);
                }
              }

              // allowNull
						  if (config[key].allowNull === false && (typeof value[key] === 'undefined' || value[key] === '')) {
							  error = `${key} is niet ingevuld`;
						  }

              // checks op type
              if (value[key]) {
                switch (config[key].type) {

                  case 'boolean':
							      if ( typeof value[key] != 'boolean' ) {
								      error = `De waarde van ${key} is geen boolean`;
							      }
                    break;

                  case 'int':
							      if ( parseInt(value[key]) !== value[key] ) {
								      error = `De waarde van ${key} is geen int`;
							      }
                    break;

                  case 'string':
							      if ( typeof value[key] != 'string' ) {
								      error = `De waarde van ${key} is geen string`;
							      }
                    break;

                  case 'object':
							      if ( typeof value[key] != 'object' ) {
								      error = `De waarde van ${key} is geen object`;
							      }
                    break;

                  case 'arrayOfStrings':
							      if ( typeof value[key] !== 'object' || !Array.isArray(value[key]) || value[key].find(val => typeof val !== 'string') ) {
								      error = `Ongeldige waarde voor ${key}`;
							      }
                    break;

                  case 'enum':
							      if ( config[key].values.indexOf(value[key]) == -1) {
								      error = `Ongeldige waarde voor ${key}`;
							      }
                    break;

                  default:
                }
              }

              if (error) {
                validated[key] = false;
                errors.push(error)
              } else {
                validated[key] = true;
              }

					  });

            Object.keys(value).forEach((key) => {
              if (typeof validated[key] == 'undefined') {
                errors.push(`${key} is niet gedefinieerd in site.config`)
              }
            });

				  } else {
            // extra data not defined in the config
            if (!( self.config && self.config.articles && self.config.articles.extraDataMustBeDefined === false )) {
              errors.push(`article.extraData is not configured in site.config`)
            }
          }
        }

        checkValue(value, configExtraData);

        if (errors.length) {
          console.log('Article validation error:', errors);
          throw Error(errors.join('\n'));
        }

				return next();

			}
		},

	});

	Article.scopes = function scopes() {

		return {

			// nieuwe scopes voor de api
			// -------------------------

			// defaults
      default: {
				include : [{
					model: db.Site,
				}]
      },

      api: {
			},

			mapMarkers: {
				attributes: [
					'id',
					'status',
					'location',
					'position'
				]
				,
				where: sequelize.or(
					{
						status: ['OPEN', 'ACCEPTED', 'BUSY']
					},
					sequelize.and(
						{status: 'CLOSED'},
						sequelize.literal(`DATEDIFF(NOW(), article.updatedAt) <= 90`)
					)
				)
			},

			// vergelijk getRunning()
			selectRunning: {
				where: sequelize.or(
					{
						status: ['OPEN', 'CLOSED', 'ACCEPTED', 'BUSY']
					},
					sequelize.and(
						{status: 'DENIED'},
						sequelize.literal(`DATEDIFF(NOW(), article.updatedAt) <= 7`)
					)
				)
			},

			includePosterImage: {
				include: [{
					model      : db.Image,
					as         : 'posterImage',
					attributes : ['key'],
					required   : false,
					where      : {},
					order      : 'sort'
				}]
			},

			includeRanking: {
// 				}).then((articles) => {
// 					// add ranking
// 					let ranked = articles.slice();
// 					ranked.forEach(article => {
// 						article.ranking = article.status == 'DENIED' ? -10000 : article.yes - article.no;
// 					});
// 					ranked.sort( (a, b) => a.ranking < b.ranking );
// 					let rank = 1;
// 					ranked.forEach(article => {
// 						article.ranking = rank;
// 						rank++;
// 					});
// 					return sort == 'ranking' ? ranked : articles;
// 				});
			},

			includeSite: {
				include : [{
					model: db.Site,
				}]
			},

			includeUser: {
				include: [{
					model      : db.User,
					attributes : ['role', 'nickName', 'firstName', 'lastName', 'email']
				}]
			},

			// vergelijk getRunning()
			sort: function (sort) {

				let result = {};

				var order;
				switch( sort ) {
					case 'createdate_asc':
						order = [['createdAt', 'ASC']];
						break;
					case 'createdate_desc':
						order = [['createdAt', 'DESC']];
						break;
					case 'date_asc':
						order = [['endDate', 'ASC']];
						break;
					case 'date_desc':
					default:
						order = sequelize.literal(`
							CASE status
								WHEN 'ACCEPTED' THEN 4
								WHEN 'OPEN'     THEN 3
								WHEN 'BUSY'     THEN 2
								WHEN 'DENIED'   THEN 0
								                ELSE 1
							END DESC,
							endDate DESC
						`);

				}

				result.order = order;

				return result;

      },

			// oude scopes
			// -----------

			summary: {
				attributes: {
					include: [
					],
					exclude: ['modBreak']
				}
			},
			withUser: {
				include: [{
					model      : db.User,
					attributes : ['role', 'nickName', 'firstName', 'lastName', 'email']
				}]
			},
			withPosterImage: {
				include: [{
					model      : db.Image,
					as         : 'posterImage',
					attributes : ['key', 'extraData'],
					required   : false,
					where      : {
						sort: 0
					}
				}]
			},
		}
	}

	Article.associate = function( models ) {
		this.belongsTo(models.User);
		this.hasMany(models.Image);
		// this.hasOne(models.Image, {as: 'posterImage'});
		this.hasMany(models.Image, {as: 'posterImage'});
		this.belongsTo(models.Site);
	}

	Article.getRunning = function( sort, extraScopes ) {

		var order;
		switch( sort ) {
			case 'createdate_asc':
				order = [['createdAt', 'ASC']];
				break;
			case 'createdate_desc':
				order = [['createdAt', 'DESC']];
				break;
			case 'date_asc':
				order = [['endDate', 'ASC']];
				break;
			case 'date_desc':
			default:
				order = sequelize.literal(`
							CASE status
								WHEN 'ACCEPTED' THEN 4
								WHEN 'OPEN'     THEN 3
								WHEN 'BUSY'     THEN 2
								WHEN 'DENIED'   THEN 0
								                ELSE 1
							END DESC,
							endDate DESC
						`);
		}

		// Get all running articles.
		// TODO: Articles with status CLOSED should automatically
		//       become DENIED at a certain point.
		let scopes = ['summary', 'withPosterImage'];
		if (extraScopes)  {
			scopes = scopes.concat(extraScopes);
		}

		let where = sequelize.or(
			{
				status: ['OPEN', 'CLOSED', 'ACCEPTED', 'BUSY', 'DONE']
			},
			sequelize.and(
				{status: 'DENIED'},
				sequelize.literal(`DATEDIFF(NOW(), article.updatedAt) <= 7`)
			)
		);

		// todo: dit kan mooier
		if (config.siteId && typeof config.siteId == 'number') {
			where = {
				$and: [
					{ siteId: config.siteId },
					...where,
				]
			}
		}

		return this.scope(...scopes).findAll({
			where,
			order   : order,
			include : [{
				attributes: []
			}]
		}).then((articles) => {
			// add ranking
			let ranked = articles.slice();
			ranked.forEach(article => {
				article.ranking = article.status == 'DENIED' ? -10000 : article.yes - article.no;
			});
			ranked.sort( (a, b) => b.ranking - a.ranking );
			let rank = 1;
			ranked.forEach(article => {
				article.ranking = rank;
				rank++;
			});
			return sort == 'ranking' ? ranked : ( sort == 'rankinginverse' ? ranked.reverse() : articles );
		}).then((articles) => {
			if (sort != 'random') return articles;
			let randomized = articles.slice();
			randomized.forEach(article => {
				article.random = Math.random();
			});
			randomized.sort( (a, b) => b.random - a.random );
			return randomized;
		})
	}

	Article.getHistoric = function() {
		return this.scope('summary').findAll({
			where: {
				status: {[Sequelize.Op.not]: ['OPEN', 'CLOSED']}
			},
			order: 'updatedAt DESC'
		});
	}

	Article.prototype.isOpen = function() {
		return this.status === 'OPEN';
	}

	Article.prototype.isRunning = function() {
		return this.status === 'OPEN'     ||
			this.status === 'CLOSED'   ||
			this.status === 'ACCEPTED' ||
			this.status === 'BUSY'
	}

	Article.prototype.setModBreak = function( user, modBreak ) {
		return this.update({
			modBreak       : modBreak,
			modBreakUserId : user.id,
			modBreakDate   : new Date()
		});
	}

	Article.prototype.setStatus = function( status ) {
		return this.update({status: status});
	}

	Article.prototype.updateImages = function( imageKeys, extraData ) {
		var self = this;
		if( !imageKeys || !imageKeys.length ) {
			imageKeys = [''];
		}

		var articleId  = this.id;
		var queries = [
			db.Image.destroy({
				where: {
					articleId : articleId,
					key    : {[Sequelize.Op.not]: imageKeys}
				}
			})
		].concat(
			imageKeys.map(function( imageKey, sort ) {
				return db.Image.update({
					articleId : articleId,
					extraData : extraData || null,
					sort   : sort
				}, {
					where: {key: imageKey}
				});
			})
		);

		return Promise.all(queries).then(function() {
			// ImageOptim.processArticle(self.id);
			return self;
		});
	}

  let canMutate = function(user, self) {
    if( !self.isOpen() ) {
			return false;
		}
    if (userHasRole(user, 'editor', self.userId)) {
      return true;
    }
    if (!userHasRole(user, 'owner', self.userId)) {
      return false;
    }
    let config = self.site && self.site.config && self.site.config.articles
    let canEditAfterFirstLikeOrArg = config && config.canEditAfterFirstLikeOrArg || false
		let voteCount = self.no + self.yes;
		let argCount  = self.argumentsFor && self.argumentsFor.length && self.argumentsAgainst && self.argumentsAgainst.length;
		return canEditAfterFirstLikeOrArg || ( !voteCount && !argCount );
  }

	Article.auth = Article.prototype.auth = {
    listableBy: 'all',
    viewableBy: 'all',
    createableBy: 'editor',
    updateableBy: ['editor','owner'],
    deleteableBy: ['editor','owner'],
    canUpdate: canMutate,
    canDelete: canMutate,
    toAuthorizedJSON: function(user, data) {

      delete data.site;
      delete data.config;
      // dit zou nu dus gedefinieerd moeten worden op site.config, maar wegens backward compatible voor nu nog even hier:
	    if (data.extraData && data.extraData.phone) {
		    delete data.extraData.phone;
	    }
      // wordt dit nog gebruikt en zo ja mag het er uit
      if (!data.user) data.user = {};
      data.user.isAdmin = userHasRole(user, 'editor');
      // er is ook al een createDateHumanized veld; waarom is dit er dan ook nog?
	    data.createdAtText = moment(data.createdAt).format('LLL');

      return data;
    },
  }

	return Article;

  function beforeValidateHook( instance, options ) {

		return new Promise((resolve, reject) => {

			if (instance.siteId) {
				db.Site.findByPk(instance.siteId)
					.then( site => {
						instance.config = merge.recursive(true, config, site.config);
						return site;
					})
					.then( site => {

						// Automatically determine `endDate`
						if( instance.changed('startDate') ) {
							var duration = ( instance.config && instance.config.articles && instance.config.articles.duration ) || 90;
							var endDate  = moment(instance.startDate).add(duration, 'days').toDate();
							instance.setDataValue('endDate', endDate);
						}

						return resolve();

					}).catch(err => {
						throw err;
					})
			} else {
				instance.config = config;
        return resolve();
			}

		});

	}

};
