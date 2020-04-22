var envProductionCms = {
  SAMPLE_DB: 'sampledbp',
  DB_NAME: 'cms',
  DB_USER: 'cms',
  DB_PASSWORD: 'okVfJfl0kPSOf0kjQcRS',
  PORT: 8201,
  PORT2: 8203,
  NODE_ENV:'production',
  DEFAULT_HOST: '.cms.openstad.amsterdam',
  DEFAULT_DB: 'default',
  APOS_WORKFLOW: 'ON',
  APP_URL: 'https://api.ragnar.baboom.nl',
  API: 'https://api.ragnar.baboom.nl',
  API_LOGOUT_URL: 'http://oauth.ragnar.baboom.nl/logout?clientId=BeWrlfCrnEwB0n1lIpRceVb7JwqlFO1',
  SESSION_SECRET: '2aGx8qkajFcVq2oh2',
  MINIFY_JS: 'ON',
  IMAGE_API_URL: 'http://image.ragnar.baboom.nl/',
  IMAGE_API_ACCESS_TOKEN: 'MHhfbasdasd15U0m8vCkA3331p',
  GOOGLE_MAPS_API_KEY: 'xxx',
  SITE_API_KEY: 'N6iYtAASAa0WYftw0Ob0bjOJZbTiIURu43VJpwGCFu26s6uqvd5wQHSyhv2kz5nkl7HXFWEIchcsR4eK441OQvB2SwrAiWt53NtzLWVxsADKn2uBMIowGgLHq2JPMJS3HsMgGXW0$',
  NODE_ENV: 'production'
}

module.exports = {
  apps : [{
    name         : 'frontend-production',
    script       : 'app.js',
  //  node_args    : '--no-warnings',
    instance_var : 'INSTANCE_ID',
    env: envProductionCms,
    env_production: envProductionCms
  }],

  deploy : {
    production : {
      user : 'manager',
      host : '188.166.66.114',
      ref  : 'origin/sitebuilder',
      repo : 'git@bitbucket.org:ToshKoevoets/sitebuilder-frontend.git',
      path : '/var/www/frontend-production/www',
      'pre-deploy': 'git reset --hard',
      'post-deploy' : `git submodule init && git submodule update && npm install && node apostrophe.js apostrophe:generation && pm2 startOrRestart /home/manager/ecosystem-frontend.config.js --only frontend-production --update-env`
    }
  }
};
