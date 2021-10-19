require('dotenv').config();
const openstadCms = require('@openstad/cms');

const contentWidgets = require('./config/contentWidgets')
const smtp = require('./config/smtp')

var apos = openstadCms.site({
  bundles: ['@openstad/cms'],
  // See lib/modules for basic project-level configuration of our modules
  // responsible for serving static assets, managing page templates and
  // configuring user accounts.

  modules: {
    '@savvycodes/openstad-event-planner-widgets': {},
    '@savvycodes/openstad-event-browser-widgets': {},
    'apostrophe-forms': {
      // Best practice: set to first or last so that inputs are nested in labels
      // and easier to style
      optionLabelPosition: 'last'
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
    }
  },
});
