require('dotenv').config();

const openstadMap = require('./config/map').default;
const openstadMapPolygons = require('./config/map').polygons;
const apostrophe = require('apostrophe');
const _ = require('lodash');
const defaultSiteConfig = require('./siteConfig');

const site = {_id: process.env.SAMPLE_DB}

const siteConfig = defaultSiteConfig.get(site, null, {}, openstadMap, openstadMapPolygons);

apostrophe(
  siteConfig
);
