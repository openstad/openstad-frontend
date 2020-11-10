# Openstad CMS 
## An implementation of apostrophecms for Amsterdam open democracy
This is the Openstad cms package based on [ApostropheCms](https://github.com/apostrophecms/apostrophe/) framework

### Prerequisites
 - [Git](https://git-scm.com/)
 - [Node.js and npm](https://nodejs.org/en/)
 - [Mongodb](https://www.mongodb.com/)

### Getting started
If you want to configure your project manually follow the steps below. You can also start with this boilerplate project: [OpenstadCms](https://github.com/amsterdam/openstad-frontend) TODO: create boilerplate project


#### 1. Install package
`npm install --save @openstad/cms`

#### 2. Set .env values
```
PORT=3000
#default name of db in mongodb, in doubt leave this to localhost
DEFAULT_DB=localhost
#Set this the default website (in development this is your local url)
DEFAULT_HOST=localhost:3000
APP_URL=http://localhost:3000
API=http://localhost:8108
#should be defined in API config, is needed to get sensitive Site configuration
SITE_API_KEY=xxxx
MAP_TYPE=googlemaps
OPENSTAD_COMPONENTS_URL=https://CDNURL
```

#### 3. Run NPM install

```
npm i
```

#### 4. Setup your application
create a index.js file with this content:
```js
const openstadCms = require('@openstad/cms');

require('dotenv').config();

var apos = openstadCms.site({
  bundles: ['@openstad/cms'],
  // See lib/modules for basic project-level configuration of our modules
  // responsible for serving static assets, managing page templates and
  // configuring user accounts.

  modules: {  }
});
```
If you want to use the cli, create a apostrophe.js file with this content:
```js
const openstadCms = require('@openstad/cms');
const modules = require('./modules').default;

const config = openstadCms.getDefaultConfig(modules);
const app = openstadCms.getSingleApp();

app(config);

```

#### 5. Create admin user

Run the following command to create a user named admin, belonging to the group admin.

```
node app.js apostrophe-users:add admin admin
```

Then visit your local website. This will trigger a password prompt in your terminal. Set the password.
You can now login to the cms at /login.


#### 6. Run dev server

```
node index.js
```

## Running multiple sites
It's possible to run multiple sites on this one apostrophecms installation. Soon more information on how.

- Every site is using a seperate mongodb 
- Every site is using a different site id in the api, where you can add configuration (e.g. mongodb settings)

## Apostrophe generation
Because of the multisite setup it's not possible anymore to run `node app apostrophe:generation`. To run this task you can use the apostrophe.js file. 
`node apostrophe apostrophe:generation` this file is using the SAMPLE_DB variable to save the generation id. 
The multisite setup is using the SAMPLE_DB in the assets part for every website. 

## Custom logging provider
It's possible to set a custom log provider on the client side, this logger will log all errors to the provider.
Currently only Bugsnag is supported, to configure the bugsnag provider you can add these env variables:

**Note:** When you create a new project in Bugsnag you need to select the Native Javascript module.
```
LOG_PROVIDER_CLIENT=bugsnag
LOG_PROVIDER_BUGSNAG_URL=
LOG_PROVIDER_BUGSNAG_KEY=
```

## Using the map-widgets
If you want to use a map in your custom module you can extend the map-widgets in the index.js of your module. 
```
module.exports = {
  extend: 'map-widgets'
```
Use the mapConfigBuilder on the server side to add data to your map:
```
widget.mapConfig = self.getMapConfigBuilder(globalData)
     .setDefaultSettings({
         mapCenterLat: 52.0,
         mapCenterLng: 4.1,
         mapZoomLevel: 16,
         zoomControl: true,
         disableDefaultUI : true,
         styles: ''
     })
     .setMarkersByIdeas(ideas)
     .setMarkerStyle(markerStyle)
     .setPolygon(req.data.global.mapPolygons || null)
     .getConfig()
 ```
You also need to extend the map-widgets on the client side:
```
apos.define('idea-single-widgets', {
    extend: 'map-widgets',
    construct: function(self, options) {
        self.play = function($widget, data, options) {          
            self.createMap(data.mapConfig);
            self.addPolygon(data.mapConfig);
            self.setIdeaMarker(data.mapConfig);
        }
    }
});
```

## Sync api config fields 
Sync widget fields with the api config:
- Enable the sync by setting this property in the widget: `openstadApiConfigSync: true,`
- Select config field from the api config: `apiSyncField: 'ideas.minimumYesVotes',`

Full widget example: 
```node
 module.exports = {
   extend: 'openstad-widgets',
   openstadApiConfigSync: true,
   addFields: [{
      name: 'minimumVotes',
      type: 'integer',
      label: 'Minimum votes for an idea',
      apiSyncField: 'ideas.minimumYesVotes',
   }]
   construct: function(self, options) {

   }
 });
```

## Overriding modules
Every module from the Openstad Cms package is overridable, just like apostrophecms modules. ApostropheCms documentation: 
https://docs.apostrophecms.org/core-concepts/technical-overview.html#project-level-overriding-and-extending-apostrophe-in-your-project

