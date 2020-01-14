# An implentation of apostrophecms for Amsterdam open democracy

## Prerequisites
 - [Git](https://git-scm.com/)
 - [Node.js and npm](https://nodejs.org/en/)
 - [Mongodb](https://www.mongodb.com/)


#### 1. Set .env values
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
```

#### 2. Run NPM install

```
npm i
```


#### 3. Create admin user

Run the following command to create a user named admin, belonging to the group admin.

```
node app.js apostrophe-users:add admin admin
```

Then visit your local website. This will trigger a password prompt in your terminal. Set the password.
You can now login to the cms at /login.


#### 3. Run dev server

```
npm run dev
```

## Running multiple sites
It's possible to run multiple sites on this one apostrophecms installation. Soon more information on how.

- Every site is using a seperate mongodb 
- Every site is using a different site id in the api, where you can add configuration (e.g. mongodb settings)

## Apostrophe generation
Because of the multisite setup it's not possible anymore to run `node app apostrophe:generation`. To run this task you can use the apostrophe.js file. 
`node apostrophe apostrophe:generation` this file is using the SAMPLE_DB variable to save the generation id. 
The multisite setup is using the SAMPLE_DB in the assets part for every website. 

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
