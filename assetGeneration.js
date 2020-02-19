require('dotenv').config();
const rp = require('request-promise');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function getAllSiteConfigs() {
  const siteOptions = {
    uri:`${process.env.API}/api/site`, //,
    headers: {
      'Accept': 'application/json',
      "Cache-Control": "no-cache"
    },
    json: true // Automatically parses the JSON string in the response
  };

  if (process.env.SITE_API_KEY) {
    siteOptions.headers["X-Authorization"] = process.env.SITE_API_KEY;
  }

  const sites = await rp(siteOptions);

  return sites.map((site) => {
    return site.config;
  })
}

async function run() {
  const siteConfigs = await getAllSiteConfigs();
  console.log(siteConfigs);
  // Todo: generate envs for every site

  siteConfigs.forEach(async (config) => {
    process.env.SAMPLE_DB = config.cms.dbName;
    const { stdout, stderr } = await exec(`node apostrophe.js apostrophe:generation`);

    console.log(stdout);
  })
}

run();
