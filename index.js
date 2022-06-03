require('dotenv').config();
const openstadCms = require('@openstad/cms');

const contentWidgets = require('./config/contentWidgets')
const smtp = require('./config/smtp')
const resources = require('./config/resources')

var apos = openstadCms.site({
  bundles: ['@openstad/cms'],
  // See lib/modules for basic project-level configuration of our modules
  // responsible for serving static assets, managing page templates and
  // configuring user accounts.

  modules: {
    'resource-pages': {
      resources: resources,
    },
    'resource-representation-widgets': {
      resources: resources,
    },
    'resource-overview-widgets': {
      resources: resources,
    },
    'resource-form-widgets': {
      resources: resources,
    },
    '@savvycodes/openstad-event-global-settings': {},
    '@savvycodes/openstad-event-planner-widgets': {},
    '@savvycodes/openstad-event-browser-widgets': {},
    '@savvycodes/openstad-event-favorites-widgets': {},
    'apostrophe-forms': {
      // Best practice: set to first or last so that inputs are nested in labels
      // and easier to style
      optionLabelPosition: 'last',
      classPrefix: 'os-form',
    },
    'apostrophe-forms-widgets': {},
    // Enable only the field widgets that your application needs to make it
    // easier for application/website managers.
    'apostrophe-forms-text-field-widgets': {},
    'apostrophe-forms-textarea-field-widgets': {},
    'apostrophe-forms-select-field-widgets': {},
    'apostrophe-email': {
      nodemailer: smtp,
    },
    settings: {
      contentWidgets: contentWidgets,
    },
  },
});
