const arguments = process.argv.slice(2);
const path = arguments[1] ? {path: arguments[1]} : undefined;

require('dotenv').config(path);

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
