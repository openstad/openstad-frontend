# Pagineren en zoeken

## Middleware

Zoeken en pagineren werkt beide als middleware. Informatie uitwisseling vindt plaats via het `req` object.

Het is geimplementeerd op alle GET list routes: Site, Idea, Article, Newslettersignup, Argument, Submission en Vote.

## Pagineren

Als je een query param `page` meestuurt dan krijg je de resultaten gepagineerd terug. Optioneel kun je een parameter `pageSize` meesturen; die default naar 20.

In dit geval krijg je naast de eigenlijke resultaten nog een set metadata terug:

```
{
  "metadata": {
    "page": 3,
    "pageSize": 20,
    "pageCount": 6,
    "totalCount": 118,
    "links": {
      "self": "/api/site/18/idea?page=3",
      "first": "/api/site/18/idea?page=0",
      "last": "/api/site/18/idea?page=5",
      "previous": "/api/site/18/idea?page=2",
      "next": "/api/site/18/idea?page=4"
    }
  },
  "records": [
    ... de resultaten
  ]
}
```

Het pagineren gebeurt in de database query. Een request op 20 records uit een tabel van 100000 zou dus best snel moeten zijn.

Maar...

Zoeken werkt niet via de query; fuzzy SQL bestaat nog niet (nauwelijks). Zoeken werkt dus op de resultaten: hij haalt de 100000 records op en daarin wordt in de JS gezocht.

Pagineren kun je dan dus ook pas achteraf doen; pagineren en zoeken samen kan dus vrij duur zijn.

## Zoeken

Zoekvragen stuur je mee als query paramter `search`. De zoekopdracht bouw je op als object in de url:

```
?search[text][criteria]=openstad&search[title][criteria]=goed&search[options][andOr]=and"
```

Een npm module als ns zet nested object automatisch om naar een bovenstaande url.

```
{
  "criteria": [
    {
      "text": "openstad"
    },
    {
      "title": "goed idee"
    }
  ],
  "options": {
    "andOr": "and"
  }
}
```

Je kunt momenteel zoeken in `titel`, `summary` en `description`. Met `text` zoek je in alle drie.

`andOr` spreek voor zich lijkt me.

Het lijkt misschien een beetje overkill, maar de idee is dat we op deze manier heel eenvoudig veel uitgebruidere zoekopdrachten kunt toevoegen.

Het zoeken zelf gebeurd door een module [fuzzysort](https://github.com/farzher/fuzzysort). Die geeft een score aan de gevonden waarden.
Je resultaten worden gesorteerd op die score; een arbitraire hardcoded minimum score bepaalt of je een resultaat uberhaubt terug krijgt.

## TODO
- Testen fuzzy search: voldoet dit?
- Bepalen van de minimum score om in de resultaten terrecht te komen; wellicht configureerbaar.
- Meer zoekopties, waarschijnlijk ook dingen als zoeken op tags
