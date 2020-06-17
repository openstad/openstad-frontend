const openstadCms = require('@openstad/cms');

const modules = require('./modules').default;

const config = openstadCms.getDefaultConfig(modules);

const app = openstadCms.getSingleApp();

app(config);
