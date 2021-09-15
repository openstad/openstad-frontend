const merge = require('merge');
const moment = require('moment');
const OAuthApi = require('../services/oauth-api');
const userHasRole = require('../lib/sequelize-authorization/lib/hasRole');

module.exports = function (db, sequelize, DataTypes) {

  var Site = sequelize.define('site', {

    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'Nieuwe site',
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: 'Nieuwe site',
    },

    domain: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'demo.openstad.nl',
    },

    config: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      get: function () {
        let value = this.getDataValue('config');
        return this.parseConfig(value);
      },
      set: function (value) {
        var currentconfig = this.getDataValue('config');
        value = value || {};
        value = merge.recursive(currentconfig, value);
        this.setDataValue('config', this.parseConfig(value));
      },
      auth: {
        viewableBy: 'admin',
      },
    },

    /*
      HostStatus is used for tracking domain status
      For instance, mostly managed by checkHostStatus service
      {
      "ip": true, // means the IP is set to this server
      "ingress": false // if on k8s cluster will try to make a ingress host file if IP address is set properly, k8s cert manager will then try get a let's encrypt cert
      } if
    */
    hostStatus: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      auth: {
        viewableBy: 'admin',
      },
    },

    areaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }

  }, {

    hooks: {

      beforeValidate: async function (instance, options) {

        try {
          // ik zou verwachten dat je dit met _previousDataValues kunt doen, maar die bevat al de nieuwe waarde
          let current = await db.Site.findOne({ where: { id: instance.id } });

          // on update of projectHasEnded also update isActive of all the parts
          if (current && typeof instance.config.projectHasEnded != 'undefined' && current.config.projectHasEnded !== instance.config.projectHasEnded) {
            let config = merge.recursive(true, instance.config);
            if (instance.config.projectHasEnded) {
              config.votes.isActive = false;
              config.ideas.canAddNewIdeas = false;
              // config.articles.canAddNewArticles = false;
              config.arguments.isClosed = true;
              // config.polls.canAddPolls = false;
              // config.users.canCreateNewUsers = false;
            } else {
              // commented: do not update these params on unsetting
              // config.votes.isActive = true;
              // config.ideas.canAddNewIdeas = true;
              // config.articles.canAddNewArticles = true;
              // config.arguments.isClosed = false;
              // config.polls.canAddPolls = true;
              // config.users.canCreateNewUsers = true;
            }
            instance.set('config', config);
          }
          
        } catch (err) {
          console.log(err);
          throw err;
        }



      },

      beforeCreate: function (instance, options) {
        return beforeUpdateOrCreate(instance, options);
      },

      beforeUpdate: function (instance, options) {
        return beforeUpdateOrCreate(instance, options);
      },

    },

  });

  async function beforeUpdateOrCreate(instance, options) {
    try {

      // TODO: dit gebeurd nu in de route maar moet denk ik naar hier
//      // canCreateNewUsers must be updated on the clients
//      if (instance.config.users && typeof instance.config.users.canCreateNewUsers != 'undefined' ) {
//        let config = { users: { canCreateNewUsers: instance.config.users.canCreateNewUsers } }
//        //        for ( let which of Object.keys(instance.config.oauth) ) { // TODO: moet deze loop naar dde OAuthApi?
//        let which = 'anonymous';
//          await OAuthApi.updateClient({ siteConfig: instance.config, which, clientData: { config } })
////        }
//      }

    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  Site.scopes = function scopes() {
    return {
      defaultScope: {},

      withArea: {
        include: [{
          model: db.Area
        }]
      }
    };
  }

  Site.associate = function (models) {
    this.hasMany(models.Idea);
    this.belongsTo(models.Area);
  }

  Site.configOptions = function () {
    // definition of possible config values
    // todo: formaat gelijktrekken met sequelize defs
    // todo: je zou ook opties kunnen hebben die wel een default hebbe maar niet editable zijn? apiUrl bijv. Of misschien is die afgeleid
    return {
      allowedDomains: {
        type: 'arrayOfStrings',
        default: [
          'openstad-api.amsterdam.nl'
        ]
      },
      allowedDomains: {
        type: 'arrayOfStrings',
        default: [
          'openstad-api.amsterdam.nl'
        ]
      },
      basicAuth: {
        type: 'object',
        subset: {
          active: {
            type: 'boolean',
            default: false,
          },
          user: {
            type: 'string',
            default: 'openstad',
          },
          password: {
            type: 'string',
            default: 'LqKNcKC7',
          },
        }
      },
      cms: {
        type: 'object',
        subset: {
          dbName: {
            type: 'string',
            default: 'default_db', //the mongodb database
          },
          url: {
            type: 'string',
            default: 'https://openstad-api.amsterdam.nl',
          },
          hostname: {
            type: 'string',
            default: 'openstad-api.amsterdam.nl',
          },
          'after-login-redirect-uri': {
            type: 'string',
            default: '/oauth/login?jwt=[[jwt]]',
          },
          "widgetDisplaySettings": {
            "type": "object",
            "subset": {
              "beta": {
                "type": "boolean",
                "default": false
              },
              "deprecated": {
                "type": "boolean",
                "default": false
              },
              "visibleWidgets": {
                "type": "arrayOfStrings",
                "default": []
              }
            }
          }
        }
      },
      notifications: {
        type: 'object',
        subset: {
          from: {
            type: 'string', // todo: add type email/list of emails
            default: 'EMAIL@NOT.DEFINED',
          },
          to: {
            type: 'string', // todo: add type email/list of emails
            default: 'EMAIL@NOT.DEFINED',
          },
        }
      },
      email: {
        type: 'object',
        subset: {
          siteaddress: {
            type: 'string', // todo: add type email/list of emails
            default: 'EMAIL@NOT.DEFINED',
          },
          thankyoumail: {
            type: 'object',
            subset: {
              from: {
                type: 'string', // todo: add type email/list of emails
                default: 'EMAIL@NOT.DEFINED',
              },
            }
          }
        }
      },
      'oauth': {
        type: 'objectsInObject',
        subset: {
          "auth-server-url": {
            type: 'string',
          },
          "auth-client-id": {
            type: 'string',
          },
          "auth-client-secret": {
            type: 'string',
          },
          "auth-server-login-path": {
            type: 'string',
          },
          "auth-server-exchange-code-path": {
            type: 'string',
          },
          "auth-server-get-user-path": {
            type: 'string',
          },
          "auth-server-logout-path": {
            type: 'string',
          },
          "after-login-redirect-uri": {
            type: 'string',
          }
        }
      },
      ideas: {
        type: 'object',
        subset: {
          canAddNewIdeas: {
            type: 'boolean',
            default: true,
          },
          titleMinLength: {
            type: 'int',
            default: 10,
          },
          titleMaxLength: {
            type: 'int',
            default: 50,
          },
          summaryMinLength: {
            type: 'int',
            default: 20,
          },
          summaryMaxLength: {
            type: 'int',
            default: 140,
          },
          descriptionMinLength: {
            type: 'int',
            default: 140,
          },
          descriptionMaxLength: {
            type: 'int',
            default: 5000,
          },
          minimumYesVotes: {
            type: 'int',
            default: 100,
          },
          showVoteButtons: {
            // momenteel alleen voor de kaart-app
            type: 'boolean',
            default: true,
          },
          canEditAfterFirstLikeOrArg: {
            type: 'boolean',
            default: false,
          },
          feedbackEmail: {
            from: {
              type: 'string', // todo: add type email/list of emails
              default: 'EMAIL@NOT.DEFINED',
            },
            subject: {
              type: 'string',
              default: undefined,
            },
            inzendingPath: {
              type: 'string',
              default: "/PATH/TO/PLAN/[[ideaId]]",
            },
            template: {
              type: 'string',
              default: undefined,
            },
          },
          extraDataMustBeDefined: {
            type: 'boolean',
            default: false,
          },
          extraData: {
            type: 'object',
          },
          types: {
            type: 'arrayOfObjects',
            default: [],
            subset: {
              name: {
                type: 'string',
                default: 'noName',
              },
              label: {
                type: 'label',
                default: 'Dit is niets',
              },
              auth: {
                type: 'object', // TODO: werk dit uit
              },
              mapIcon: {
                type: 'string',
                default: '',
              },
              listIcon: {
                type: 'string',
                default: '',
              },
              buttonIcon: {
                type: 'string',
                default: '',
              },
              buttonLabel: {
                type: 'string',
                default: '',
              },
              backgroundColor: {
                type: 'string',
                default: '#164995',
              },
              textColor: {
                type: 'string',
                default: 'white',
              },
              // TODO: deze komen uit cms thema; werk dat verder uit
              "flag": {type: 'string', default: ''},
              "mapUploadedFlag": {type: 'string', default: ''},
              "mapFlagWidth": {type: 'string', default: ''},
              "mapFlagHeight": {type: 'string', default: ''},
              "Initialavailablebudget": {type: 'int', default: 0},
              "minimalBudgetSpent": {type: 'int', default: 0},
            }
          },
          automaticallyUpdateStatus: {
            isActive: {
              type: 'boolean',
              default: false,
            },
            afterXDays: {
              type: 'int',
              default: 90,
            },
          },
        }
      },
      arguments: {
        type: 'object',
        subset: {
          new: {
            type: 'object',
            subset: {
              anonymous: {
                type: 'object',
                subset: {
                  redirect: {
                    type: 'string',
                    default: null,
                  },
                  notAllowedMessage: {
                    type: 'string',
                    default: null,
                  }
                }
              },
              showFields: {
                type: 'arrayOfStrings', // eh...
                default: ['zipCode', 'nickName'],
              }
            }
          },

          isClosed: {
            type: 'boolean',
            default: false,
          },

          closedText: {
            type: 'string',
            default: 'De reactiemogelijkheid is gesloten, u kunt niet meer reageren',
          },

        }
      },
      users: {
        type: 'object',
        subset: {
          extraDataMustBeDefined: {
            type: 'boolean',
            default: false,
          },
          extraData: {
            type: 'object',
          },
          canCreateNewUsers: {
            type: 'boolean',
            default: true,
          },
        },
      },
      votes: {
        type: 'object',
        subset: {

          isViewable: {
            type: 'boolean',
            default: false,
          },

          isActive: {
            type: 'boolean',
            default: null,
          },

          isActiveFrom: {
            type: 'string',
            default: undefined,
          },

          isActiveTo: {
            type: 'string',
            default: undefined,
          },

          requiredUserRole: {
            type: 'string',
            default: 'member',
          },

          mustConfirm: {
            type: 'boolean',
            default: false,
          },

          withExisting: {
            type: 'enum',
            values: ['error', 'replace', 'merge'],
            default: 'error',
          },

          voteType: {
            type: 'enum',
            values: ['likes', 'count', 'budgeting', 'count-per-theme', 'budgeting-per-theme'],
            default: 'likes',
          },

          voteValues: {
            type: 'arrayOfObjects',
            default: [
              {
                label: 'voor',
                value: 'yes'
              },
              {
                label: 'tegen',
                value: 'no'
              },
            ],
          },

          maxIdeas: {
            type: 'int',
            default: 100,
          },

          minIdeas: {
            type: 'int',
            default: 1,
          },

          minBudget: {
            type: 'int',
            default: undefined,
          },

          maxBudget: {
            type: 'int',
            default: undefined,
          },

          themes: {
            type: 'objectList',
            elementSubset: {
              minBudget: {
                type: 'int',
                default: undefined,
              },
              maxBudget: {
                type: 'int',
                default: undefined,
              },
            }
          },

        },
      },

      articles: {
        type: 'object',
        subset: {
          canAddNewArticles: {
            type: 'boolean',
            default: true,
          },
          titleMinLength: {
            type: 'int',
            default: 10,
          },
          titleMaxLength: {
            type: 'int',
            default: 50,
          },
          summaryMinLength: {
            type: 'int',
            default: 20,
          },
          summaryMaxLength: {
            type: 'int',
            default: 140,
          },
          descriptionMinLength: {
            type: 'int',
            default: 140,
          },
          descriptionMaxLength: {
            type: 'int',
            default: 5000,
          },
          minimumYesVotes: {
            type: 'int',
            default: 100,
          },
          canEditAfterFirstLikeOrArg: {
            type: 'boolean',
            default: false,
          },
          feedbackEmail: {
            from: {
              type: 'string', // todo: add type email/list of emails
              default: 'EMAIL@NOT.DEFINED',
            },
            subject: {
              type: 'string',
              default: 'Bedankt voor je artikel',
            },
            inzendingPath: {
              type: 'string',
              default: "/PATH/TO/ARTICLE/[[articleId]]",
            },
            template: {
              type: 'string',
              default: undefined,
            },
          },
          extraDataMustBeDefined: {
            type: 'boolean',
            default: false,
          },
          extraData: {
            type: 'object',
          }
        }
      },

      polls: {
        type: 'object',
        subset: {
          canAddPolls: {
            type: 'boolean',
            default: false,
          },
          requiredUserRole: {
            type: 'string',
            default: 'anonymous',
          },
        },
      },

      newslettersignup: {
        type: 'object',
        subset: {
          isActive: {
            type: 'boolean',
            default: false,
          },
          autoConfirm: {
            type: 'boolean',
            default: false,
          },
          "confirmationEmail": {
            type: 'object',
            subset: {
              from: {
                type: 'string', // todo: add type email/list of emails
                default: 'EMAIL@NOT.DEFINED',
              },
              subject: {
                type: 'string',
                default: undefined,
              },
              url: {
                type: 'string',
                default: "/PATH/TO/CONFIRMATION/[[token]]",
              },
              template: {
                type: 'string',
                default: undefined,
              },
            },
          },
        },
      },

      host: {
        status: null,
      },

      "ignoreBruteForce": {
        type: 'arrayOfStrings',
        default: []
      },

    }
  }

  Site.prototype.parseConfig = function (config) {


    try {
      if (typeof config == 'string') {
        config = JSON.parse(config);
      }
    } catch (err) {
      config = {};
    }

    let options = Site.configOptions();


    config = checkValues(config, options)

    return config;

    function checkValues(value, options) {

      let newValue = {};
      Object.keys(options).forEach(key => {

        // backwards compatibility op oauth settings
        if (key == 'oauth' && value[key] && !value[key].default && (value[key]['auth-server-url'] || value[key]['auth-client-id'] || value[key]['auth-client-secret'] || value[key]['auth-server-login-path'] || value[key]['auth-server-exchange-code-path'] || value[key]['auth-server-get-user-path'] || value[key]['auth-server-logout-path'] || value[key]['after-login-redirect-uri'])) {
          // dit is een oude
          value[key] = {default: value[key]};
        }

        // TODO: 'arrayOfObjects' met een subset

        // objects in objects
        if (options[key].type == 'object' && options[key].subset) {
          let temp = checkValues(value[key] || {}, options[key].subset); // recusion
          return newValue[key] = Object.keys(temp) ? temp : undefined;
        }

        // objects in objects
        if (options[key].type == 'objectsInObject' && options[key].subset && value[key]) {
          newValue[key] = {};
          let elementkeys = Object.keys(value[key]);
          for (let i = 0; i < elementkeys.length; i++) {
            let elementkey = elementkeys[i];
            if (value[key][elementkey] == null) {
            } else {
              let temp = checkValues(value[key][elementkey] || {}, options[key].subset); // recusion
              newValue[key][elementkey] = Object.keys(temp) ? temp : undefined;
            }
          }
          return newValue[key];
        }

        // TODO: in progress
        if (typeof value[key] != 'undefined' && value[key] != null) {
          if (options[key].type && options[key].type === 'int' && parseInt(value[key]) !== value[key]) {
            throw new Error(`site.config: ${key} must be an int`);
          }
          if (options[key].type && options[key].type === 'string' && typeof value[key] !== 'string') {
            throw new Error(`site.config: ${key} must be an string`);
          }
          if (options[key].type && options[key].type === 'boolean' && typeof value[key] !== 'boolean') {
            throw new Error(`site.config: ${key} must be an boolean ${value[key]}, ${options}, ${typeof value[key]}`);
          }
          if (options[key].type && options[key].type === 'object' && typeof value[key] !== 'object') {
            throw new Error(`site.config: ${key} must be an object`);
          }
          if (options[key].type && options[key].type === 'arrayOfStrings' && !(typeof value[key] === 'object' && Array.isArray(value[key]) && !value[key].find(val => typeof val !== 'string'))) {
            throw new Error(`site.config: ${key} must be an array of strings`);
          }
          if (options[key].type && options[key].type === 'arrayOfObjects' && !(typeof value[key] === 'object' && Array.isArray(value[key]) && !value[key].find(val => typeof val !== 'object'))) {
            throw new Error(`site.config: ${key} must be an array of objects`);
          }
          if (options[key].type && options[key].type === 'enum' && options[key].values && options[key].values.indexOf(value[key]) == -1) {
            throw new Error(`site.config: ${key} has an invalid value`);
          }
          return newValue[key] = value[key];
        }

        // default?
        if (typeof options[key].default != 'undefined') {
          return newValue[key] = options[key].default
        }

        // set to null
        if (value[key] == null) {
          newValue[key] = value[key] = undefined;
        }

        // allowNull?
        if (!newValue[key] && options[key].allowNull === false) {
          throw new Error(`site.config: $key must be defined`);
        }

        return newValue[key];

      });

      // voor nu mag je er in stoppen wat je wilt; uiteindelijk moet dat zo gaan werken dat je alleen bestaande opties mag gebruiken
      // dit blok kan dan weg
      Object.keys(value).forEach(key => {
        if (typeof newValue[key] == 'undefined') {
          newValue[key] = value[key];
        }
      });
      return newValue;
    }

  }

  Site.prototype.willAnonymizeAllUsers = async function () {

    let self = this;
    let result = {};

    try {

      if (!self.id) throw Error('Site not found');
      if (!self.config.projectHasEnded) throw Error('Cannot anonymize users on an active site - first set the project-has-ended parameter');

      let users = await db.User.findAll({ where: { siteId: self.id } });

      // do not anonymize admins
      result.admins = users.filter( user => userHasRole(user, 'admin') );
      result.users  = users.filter( user => !userHasRole(user, 'admin') );

      // extract externalUserIds
      result.externalUserIds = result.users.filter( user => user.externalUserId ).map( user => user.externalUserId );

    } catch (err) {
      console.log(err);
      throw err;
    }

    return result;
    
  }

  Site.prototype.doAnonymizeAllUsers = async function () {

    // anonymize all users for this site
    let self = this;
    let result;

    try {

      result = await self.willAnonymizeAllUsers();

      let users = [ ...result.users ]

      // anonymize users
      for (const user of users) {
        user.site = self;
        let res = await user.doAnonymize();
      }

    } catch (err) {
      console.log(err);
      throw err;
    }

    result.message = 'Ok';
    return result;

  }

  Site.prototype.isVoteActive = function () {
    let self = this;
    let voteIsActive = self.config.votes.isActive;
    if ( ( voteIsActive == null || typeof voteIsActive == 'undefined' ) && self.config.votes.isActiveFrom && self.config.votes.isActiveTo ) {
      voteIsActive = moment().isAfter(self.config.votes.isActiveFrom) && moment().isBefore(self.config.votes.isActiveTo)
    }
    return voteIsActive;
  }

  Site.auth = Site.prototype.auth = {
    listableBy: 'all',
    viewableBy: 'all',
    createableBy: 'admin',
    updateableBy: 'admin',
    deleteableBy: 'admin',
    canAnonimizeAllUsers : function(user, self) {
      self = self || this;
      if (!user) user = self.auth && self.auth.user;
      if (!user || !user.role) user = { role: 'all' };
      let isValid = userHasRole(user, 'admin', self.id);
      return isValid;
    }

  }

  return Site;

};
