var config         = require('config')
    , log            = require('debug')('app:user')
    , pick           = require('lodash/pick');
const { Op } = require('sequelize')

const Url = require('url');

var dateFilter   = require('../lib/nunjucks-date-filter');

var sanitize        = require('../util/sanitize');
var nunjucks        = require('nunjucks');
var env             = nunjucks.configure('email');
const htmlToText   = require('html-to-text');

env.addFilter('date', dateFilter);
// Global variables.
env.addGlobal('HOSTNAME', config.get('hostname'));
env.addGlobal('SITENAME', config.get('siteName'));
//env.addGlobal('PAGENAME_POSTFIX', config.get('pageNamePostfix'));
env.addGlobal('EMAIL', config.get('emailAddress'));
env.addGlobal('GLOBALS', config.get('express.rendering.globals'));
env.addGlobal('config', config);

const mailTransporter = require('../lib/mailTransporter');

// Default options for a single email.

const sendMail = (options) => {
    return Promise((resolve, reject) => {
        mailTransporter.getTransporter().sendMail(
            options,
            function( error, info ) {
                if ( error ) {
                    reject(error.message);
                } else {
                    resolve(info.response);
                }
            }
        );
    });
}


module.exports = function( db, sequelize, DataTypes ) {
    var Action = sequelize.define('action', {
        siteId: {
            type         : DataTypes.INTEGER,
            defaultValue : 0,
        },

        accountId: {
            type         : DataTypes.INTEGER,
            defaultValue : 0,
        },


        status: {
            type         : DataTypes.ENUM('active', 'inactive'),
            defaultValue : 'active',
            allowNull    : false
        },

        priority : {
            type         : DataTypes.INTEGER,
            defaultValue : 0,
        },

        name: {
            type         : DataTypes.STRING(64),
            allowNull    : true,
            set          : function( value ) {
                this.setDataValue('name', sanitize.noTags(value));
            }
        },

        settings: {
            type: DataTypes.JSON,
            allowNull		 : false,
            defaultValue : [],
        },

        conditions: {
            type: DataTypes.JSON,
            allowNull		 : true,
            defaultValue : null,
        },

        action: {
            type: DataTypes.JSON,
            allowNull		 : false,
            defaultValue : [],
        },
    }, {
        charset: 'utf8',
        validate: {},
    });

    Action.scopes = function scopes() {
        return {

        }
    }

    Action.associate = function( models ) {
        this.belongsTo(models.User, {constraints: false});
    }

    Action.types = [
        {
            name: 'createModel',
            act: async (action, selectedResource, req, res) => {
                const {modelName, values} = settings;

                if (!modelName) {
                    throw new Error('No model name defined for create resource action');
                }

                if (!db[resource]) {
                    throw new Error('No modelname defined for create resource action');
                }

                try {
                    await db[resource].create(values);
                } catch(e) {
                    throw new Error('Error while creating model in createModel action for variables: '+ JSON.stringify(variables));
                }

            }
        },
        {
            name: 'mail',
            act: async (action, selectedResource, req, res) => {
                const {
                    usePredefinedTemplate,
                    templateString,
                    templateName,
                    data,
                    subject,
                    fromAddress,
                    conditions
                } = action.settings;

                console.log('Start email action ', action, ' with selectedResource', selectedResource);

                let recipientUsers = [];

                for (var i = 0; i < recipients.length; i++) {
                    const recipient = recipients[i];

                    if (recipient.type === 'owner') {
                        /**
                         * @todo better handling of getting users
                         * fetch all users connected to accountId, probably can just set better type
                         */
                        recipientUsers = selectedResources.filter((selectedResource) => {
                            return (selectedResource.user && selectedResource.user) || (selectedResource.account && selectedResource.account);
                        }).map((selectedResource) => {

                            if (selectedResource.account.email) {
                                return {
                                    email: selectedResource.account.email,
                                    firstName:  selectedResource.account.firstName,
                                    lastName:  selectedResource.account.lastName,
                                }
                            } else {
                                return selectedResource.user;
                            }
                        });

                        console.log('recipient.type owner and found: ', recipientUsers);
                    }

                    if (recipient.type === 'admin') {
                        /**
                         * Todo fetch admin for all sites
                         */
                    }

                    if (recipient.type === 'static') {
                        recipientUsers.concat(recipient.users)
                    }
                }

                // make sure email list is unique, does this work with nested?
                recipientUsers = Array.from(new Set(recipientUsers));

                console.log('All recipientUsers ', recipientUsers);

                let html = '';

                if (recipientEmails.length > 0) {
                    for (var i = 0; i < recipientEmails.length; i++) {

                        const recipientUser = recipientUsers[i];
                        const recipientEmail = recipientUser.email;

                        console.log('Trying email for recipientUser ', recipientUser);

                        if (!recipientEmail) {
                            console.log('Email empty for recipientUser ', recipientUser);
                            return false;
                        }

                        // we double check to make sure e-mail/notify actions really only
                        const actionLog = await db.ActionLog.findOne({
                            actionId: action.id,
                            email: recipientEmail
                        });

                        if (actionLog) {
                            return await db.Event.create({
                                message: `Tried to email ${recipientEmail} double in action ${action.id}`,
                                name: 'doubleEmailAttemptStop',
                                type: 'warning',
                                resourceId: action.id,
                                resourceType: 'action'
                            });
                        }

                        const templateData = {
                            ...data,
                            activeResource: selectedResource,
                            recipient: recipientUsers
                        }

                        if (usePredefinedTemplate) {
                            html = nunjucks.render(templateName + '.njk', templateData);
                        } else {
                            html = nunjucks.renderString(templateString, templateData);
                        }

                        let text = htmlToText.fromString(html, {
                            ignoreImage: true,
                            hideLinkHrefIfSameAsText: true,
                            uppercaseHeadings: false
                        });

                        const response = await sendMail({
                            // in some cases the resource, like order or account has a different email from the submitted user, default to resource, otherwise send to owner of resource
                            to: recipientEmail, //resource.email ?  resource.email : user.email,
                            from: fromAddress,
                            subject: subject,
                            html: html,
                            text: text,
                        });

                        console.log('Response for successful email is : ', response)

                        //assume success for now
                        await db.ActionLog.create({
                            actionId: action.id,
                            email: recipientEmail,
                            userId: recipientUser.id
                        });
                    }
                } else {
                    console.log(`No recipients found for action with ID ${action.id}`);
                }
            }
        }
    ]

    Action.prototype.getSelection = async (checkFromDate) => {
        let selection = [];

        if (!this.conditions) {
            return selection;
        }

        let where = {};

        /**
         * Example:
         * {
         *     model: 'NewsletterSignup',
         *     event: 'create'
         * },
         * {
         *     model: 'Account',
         *     event: 'after',
         *     hours: 158,
         *     filters: [
         *         {
         *             key: "status",
         *             value: "trial"
         *         }
         *     ]
         * },
         *
         */
        const conditions = this.conditions;
        const siteId = this.siteId;
        const modelName = conditions.model;
        const eventName = conditions.event;
        const filters = conditions.filters;
        const hours = conditions.hours;

        if (!db[modelName]) {
            throw new Error(`Model defined as ${modelName} in conditions of action with id ${this.id} doesn't exists.`)
        }

        /**
         * @todo Scenario's after 7 days set a model to new status
         */
        switch (eventName) {
            case 'create':
                // Sequelize.literal('NOW() - INTERVAL \'7d\'')
                where = {
                    'createdAt' : {
                        [Op.gte] : checkFromDate
                    }
                }
                break;
            case 'after':
                const escapedAfter = sequelize.escape(`${hours}`);

                where = {
                    'createdAt' : {
                        [Op.gte] : Sequelize.literal(`DATE_SUB(NOW(), INTERVAL ${escapedAfter} HOUR)`),
                        // add the date check to make sure
                        [Op.gte]: checkFromDate,
                    }
                }
                break;
            case 'update':
                where = {
                    'updatedAt' : checkFromDate
                }

                break;

            default:
                throw new Error(`Event defined as ${modelName} in conditions of action with id ${this.id}`)
        }

        // add filters to where object
        // so for instance filters can be [{key: 'status', value: 'PUBLISHED'}]
        // currently only = operator, but easy to add more when needed

        if (filters) {
            filters.forEach((filter) => {
                where[filter.key] = filter.value;
            })
        }

        where.siteId = siteId;

        selection = await db[modelName].findAll({
            where: where
        });

        return selection;
    };

    Action.run = async (req, res) => {
        const self = this;

        //resource, action, lastCheck
        // trigger, resource created
        try {
            // Get last run
            const lastRun = await db.ActionsRun.findOne({
                order: [ [ 'createdAt', 'DESC' ]],
            });

            if (lastRun && lastRun.status === 'running') {
                throw new Error(`Last run with id ${lastRun.id} still has status running, new run not starting`);
                return
            }

            // if it fails before we get to the end, currently the run will be stuck, need to have a self healing
            // mechanism, or report option
            const currentRun = await db.ActionsRun.create({ status: 'running'});

            // Get last run date, or now, don't leave blanco otherwise a run can target all previous resources
            // Running actions on lots of rows in the past. In same cases that might desired, but is not default behaviour
            const lastRunDate = lastRun ? lastRun.createdAt : new Date().toISOString().slice(0, 19).replace('T', ' ');

            const actions = db.Actions.findAll({
                where: {
                    //only fetch items that are always running
                    type: 'continuously'
                },
                order: [ [ 'priority', 'DESC' ], [ 'createdAt', 'DESC' ]],
            });

            for (var i = 0; i < actions.length; i++) {
                const action = actions[i];

                const actionType = db.Actions.types.find(actionType => actionType.name === action.type);

                if (!actionType) {
                    throw new Error(`Action type ${action.type} not found in ActionSequence with id ${self.id}`);
                }

                // array, can be one or more
                const selectionToActUpon = await action.getSelection(lastRunDate);

                // there are also actions where all the resources should be bundled, or treated as one
                for (var j = 0; j < selectionToActUpon.length; j++) {
                    const selectedResource = selectionToActUpon[j];

                    try {
                        // cron runs req, res will be empty, this will cause request actions to fail in case people try to run them as cron
                        // which is perfectly fine, the act method should properly display an error here.
                        await actionType.act(action, selectedResource, req, res);

                        await db.ActionLog.create({
                            actionId: action.id,
                            settings: settings,
                            status: 'success'
                        });
                    } catch(e) {
                        await db.ActionLog.create({
                            actionId: action.id,
                            settings: settings,
                            status: 'error'
                        });
                    }
                }
            }

            await currentRun.update({ status: 'finished' });
        } catch (e) {
            console.log('Error while executing ActionSequence with id ', self.id, ' with the following error: ', error);
        }
    }

    return Action;
};
