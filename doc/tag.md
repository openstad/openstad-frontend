# Tags

## Inhoud
[Beschrijving](#beschrijving)
[Endpoints](#endpoints)
[Ideas](#ideas)
[ToDo](#todo)

## Beschrijving

Tags zijn objecten om ideas (en straks articles) te kunnen voorzien van een label. Ze hebben alleen een name field.

Voor het beheren van tags zijn er standaard CRUD endpoints.

In ideas zijn tags terug gebracht tot alleen de name, zowel in de resultaten als in de create/update van het idee.

```
{ "tags": ["Rode fietsen", "Gele auto's"] }
```

Beheren van tags kan alleen admin. Toevoegen aan ideeen kan iedereen die een idee kan bewerken.

## Endpoints

Standaard CRUD

#### List all tags
```
GET :HOSTNAME/api/site/:SITE_ID/tag
```

#### Show one tag
```
GET :HOSTNAME/api/site/:SITE_ID/tag/:TAG_ID
```

#### Create a tag
```
POST :HOSTNAME/api/site/:SITE_ID/tag

{
  "name": "Fietsen"
}
```

#### Update a tag
```
PUT :HOSTNAME/api/site/:SITE_ID/tag/:TAG_ID

{
  "name": "Rode fietsen"
}
```

#### Delete an tag
```
DELETE :HOSTNAME/api/site/:SITE_ID/tag/:TAG_ID
```

## Ideas

Op idee niveau worden tags alleen op name gebruikt.

Gebruik includeTags om tags in het resultaat mee te nemen:
```
GET :HOSTNAME/api/site/:SITE_ID/idea?includeTags=1
```
Dat geeft dan als resultaat
```
{
  ...idea fields
  "tags": ["Rode fietsen", "Gele auto's"],
  ...more idea fields
}
```

Zo stuur je ze ook mee bij het creeren of updaten van een idea:
```
PUT :HOSTNAME/api/site/:SITE_ID/idea/:IDEA_ID

{
  "title": "Updated title",
  "tags": ["Rode fietsen", "Gele auto's"],
  ...more idea fields
}

```

Zoeken van ideas op tags doe je ook met een query parameter:
```
GET :HOSTNAME/api/site/:SITE_ID/idea?selectTags=Rode%20fietsen&selectTags=Gele%20auto's
```

## TODO
- deze pagina opnemen in de inhoudsopgave, maar als ik dat nu doe dan krijg je merge conflicts met hotfix/002 en 003
- na merge van hotfix/003 moet deze functionaliteit vermoedelijk ook naar articles
- selectTags is eeen OR; ik zie zo geen toepassing voor een AND, maar wellicht moet er dus nog een selectAllTags komen
- ik kan me nog voorstellen dat je tags in tags wilt kunnen hangen, dat zou dan ook een todo zijn