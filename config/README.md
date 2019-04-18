## Maps

Polygonen op de kaart worden getekend op basis van config.openStadMap.polygon, te definieren in local.json:

```
"openStadMap": {
	"googleKey": "[GOOGLE MAPS KEY]",
	"polygon": [{ "lng": 4.8164041, "lat": 52.3274057 }, { "lng": 4.8171288, "lat": 52.326920200000004 }, { "lng": 4.8177113, "lat": 52.326437900000002 }, { "lng": 4.818136, "lat": 52.325969100000002 }, ... { "lng": 4.8164041, "lat": 52.3274057 }]
}
```

De polygonen in default.json zijn alleen referenties; ze worden niet gebruikt.

Om een poygon te krijgen kun je dit gebruiken:

You can get polygon coordenates in json for using with googlemaps using openstreetmap. Go to <http://nominatim.openstreetmap.org/> search a place like "Partido de Ituzaingó"

Click on "details"

Look for OSM ID and copy it, example: 2018776

paste the ID in <http://polygons.openstreetmap.fr/index.py> and download the polygon

