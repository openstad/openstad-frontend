const openstadCms = require('@openstad/cms');

require('dotenv').config();

const modules = require('./modules').default;

const config = openstadCms.getDefaultConfig(modules);

const app = openstadCms.getSingleApp();

app(config);
