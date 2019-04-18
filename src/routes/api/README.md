# Algemeen

Dit is een JSON API server

## Login

```GET /oauth/login```
en 
```GET /oauth/site/:SITE_ID/login```

Als je een site meestuurt dan haalt hij die site op en gebruikt de oauth config settings daarvan (waar gedefinieerd; zie onder Site) in plaats van de opties in de local.json config.

Hij logt de gebruiker in als gewone, lokale, monolith user, en vanaf daar werkt dat als verwacht. Die user wordt zonodig aangemaakt.
Voor nu ga ik er vanuit dat de required fields email, firstName, lastName en postcode beschikbaar zijn in mijnopenstad. Een nieuwe user heeft de role 'member'

Hij redirect naar site.config.cms['after-login-redirect-uri'] of req.site.config.oauth['after-login-redirect-uri'] of authorization['after-login-redirect-uri'] uit de local.json

Die redirect url zou `[[JWT]]` moeten bevatten. Op die plak wordt je JWT toegevoegd.

Met die JWT kun je ook API calls doen. Die moet je meesturen als header:
```X-Authorization: Bearer JWT```

Dat heet `X-Authorization` omdat hij anders botst met de basic authentication

Dat is denk ik hoe buurtbudget het doet? Over een oplossing voor de GET met JWT heb ik wel ideeen, maar moeten we denk ik even bespreken.

```GET /oauth/me```
en 
```GET /oauth/site/:SITE_ID/me```

Get the user for this JWT. Site ID wordt niet gebruikt maar de route bestaat wegens consistent.



#### TODO
- rollen moeten denk ik naar mijnoopenstad
- flexibiliteit mbt. tot velden in mijnopenstad versus lokaal
- per site inloggen; je logt nu in op alles
- verzin iets beters dan X-Authorization


## Site

`GET /api/site/`
list all sites

`POST /api/site/`
create a site

`GET /api/site/:SITE_ID`
view one site

`PUT /api/site/:SITE_ID`
update one site

`DELETE /api/site/:SITE_ID`
delete one site

GET request zijn public, de anderen alleen toegankelijk voor admin

#### config

Sites hebben een veld config. Dat is een json veld.

Uiteindelijk zal de API alleen config vars opslaan die zijn gedefineerd. Voor nu accpeteert hij alles om ontwikkelwerk eenvoudiger te maken.

De gedefinieerde config wordt nog wel gebruikt voor defaults etc. Die ziet er nu zo uit (maar dat is volgende week vast weer anders):

```{
  "cms": {
    "url": {
      "type": "string",
      "default": "https://openstad-api.amsterdam.nl"
    },
    "hostname": {
      "type": "string",
      "default": "openstad-api.amsterdam.nl"
    },
    "after-login-redirect-uri": {
      "type": "string",
      "default": "/oauth/login?jwt=[[jwt]]"
    }
  },
  "notifications": {
    "to": {
      "type": "string",
      "default": "EMAIL@NOT.DEFINED"
    }
  },
  "email": {
    "siteaddress": {
      "type": "string",
      "default": "EMAIL@NOT.DEFINED"
    },
    "thankyoumail": {
      "from": {
        "type": "string",
        "default": "EMAIL@NOT.DEFINED"
      }
    }
  },
  "oauth": {
    "auth-server-url": {
      "type": "string"
    },
    "auth-client-id": {
      "type": "string"
    },
    "auth-client-secret": {
      "type": "string"
    },
    "auth-server-login-path": {
      "type": "string"
    },
    "auth-server-exchange-code-path": {
      "type": "string"
    },
    "auth-server-get-user-path": {
      "type": "string"
    },
    "auth-server-logout-path": {
      "type": "string"
    },
    "after-login-redirect-uri": {
      "type": "string"
    }
  },
  "ideas": {
    "noOfColumsInList": {
      "type": "int",
      "default": 4
    }
  },
  "arguments": {
    "new": {
      "anonymous": {
        "type": "object",
        "subset": {
          "redirect": {
            "type": "string",
            "default": null
          },
          "notAllowedMessage": {
            "type": "string",
            "default": null
          }
        }
      },
      "showFields": {
        "type": "arrayOfStrings",
        "default": [
          "zipCode",
          "nickName"
        ]
      }
    }
  },
  "votes": {
    "maxChoices": {
      "type": "int",
      "default": 1
    },
    "userRole": {
      "type": "string",
      "default": "anonymous"
    },
    "withExisting": {
      "type": "enum",
      "values": [
        "error",
        "replace",
        "createOrCancel",
        "replaceAll"
      ],
      "default": "replace"
    },
    "mustConfirm": {
      "type": "boolean",
      "default": false
    }
  }
}
```

## Idea

`GET /api/site/:SITE_ID/idea/`
list all ideas

`POST /api/site/:SITE_ID/idea/`
create an idea

`GET /api/site/:SITE_ID/idea/:IDEA_ID`
view one idea

`PUT /api/site/:SITE_ID/idea/:IDEA_ID`
update one idea

`DELETE /api/site/:SITE_ID/idea/:IDEA_ID`
delete one idea

GET request zijn public, POST is alleen toegankelijk voor admin, de anderen alleen voor admin en de eigenaar

Je kunt aan de GETs query parameters meegeven. Die werken als scopes voor Sequelize; dat komt uit de bestaande app. Bestaande scopes zijn:

`selectRunning`
`includeArguments`
`includeMeeting`
`includePosterImage`
`includeUser`
`includeVoteCount`
`includeUserVote`

#### extraData
ideas hebben een extraData veld dat een JSON object bevat. De toegestane waarden daarin worden gedefinieerd in de config van de API danwel van de site:
```
  "ideas": {
    "extraData": {
      "gebied": {
				"type": "enum",
				"values": ["Oud-West", "Bos en Lommer", "De Baarsjes", "Westerpark", "West Algemeen"],
				"allowNull": false,
			},
			"thema": {
				"type": "enum",
				"values": ["Groen", "Diversiteit & Inclusiviteit", "Duurzaam"],
				"allowNull": false,
			},
			"images": {
				"type": "arrayOfStrings",
				"allowNull": true
			}
    }
	}
```

#### TODO
- Wat hier nog niet is geimplementeerd is een oplossing voor images; je krijgt nu terug wat er in de DB zit.
- Ik denk dat er een overkoepelend idea zou moeten zijn, maar even overleggen

## Vote

`GET /api/site/:SITE_ID/vote`
list all votes for a site

`GET /api/site/:SITE_ID/idea/:IDEA_ID/vote`
list all votes for one idea

`GET /api/site/:SITE_ID/idea/:IDEA_ID/vote?opinion=no`
list all votes for one idea where opinion is 'no'

`POST /api/site/:SITE_ID/vote`
`POST /api/site/:SITE_ID/idea/:IDEA_ID/vote`
create or update votes

Payload:
```
[
  {
    "ideaId": 7,
    "opinion": "yes"
  },
  {
    "ideaId": 8,
    "opinion": "yes"
  },
  {
    "ideaId": 9,
    "opinion": "yes"
  },
  {
    "ideaId": 10,
    "opinion": "yes"
  }
]
```

Het laatste is ontwikkeling

Ik denk dat de budgetVotes die we in westbegroot gebruiken ook simpele votes kunnen worden. In plaats van 1 record met ideaIds kan er een vote record per ideaId worden gemaakt.

we hebben dan:
- stemvan stemmen: je kunt op elk open plan een voor of tegen stem uitbrengen. Nog een keer stemmen vervangt of annuleert de oude.
- westbegroot: in principe hetzelfde, maar dan in bulk. Je kunt bovendien niet meer wijzigen.
- javabrug: ook in bulk, maar je kunt nog wel wijzigen
- kareldoorman en kademuren: max 1 stem, die je nog kunt wijzigen
- eberhard: max 1 stem, die je bovendien moet bevestigen

Met andere woorden: het uitbrengen van een stem kan per ideaId of in bulk. Wat er gebeurd als je opnieuw iets instuurt is afhankelijk van de configuratie.
Er moet ook iets komen om extra validaties te kunnen doen, zoals die bijvoorbeeld in westbegroot zitten

Daarnaast zijn er wellicht nog wat frontend opties, zoals de sterren van javabrug

```
config: {
  votes: {
    maxChoices: int || null,
    widthExisting: 'error' || 'replace' || 'createOrCancel' || 'replaceAll',
    mustConfirm: true || false,
    userRole: minimum role required
  }
}
```

#### TODO
- config.votes.userRole doet nog niets. Je moet nu member zijn om te mogen stemmen. Dat zal ook anomniem moeten kunnen, waarbij hij dan automatisch een gebruiker aanmaakt (ook in mijnopenstad). Aanpassen rolePlay daarop.
- config.votes.maxChoices doet nog niets.
- config.votes.mustConfirm doet nog niets.
- er is nu alleen db validatie


## Argument

`GET /api/site/:SITE_ID/argument`
list all arguments for a site

`GET /api/site/:SITE_ID/idea/:IDEA_ID/argument`
list all arguments for one idea

`GET /api/site/:SITE_ID/idea/:IDEA_ID/argument?sentiment=for`
list all arguments for one idea where sentiment is 'for'

`GET /api/site/:SITE_ID/idea/:IDEA_ID/argument/:ARG_ID`
view one argument

`POST /api/site/:SITE_ID/idea/:IDEA_ID/argument`
create an argument

`PUT /api/site/:SITE_ID/idea/:IDEA_ID/argument/:ARG_ID`
update one argument

`DELETE /api/site/:SITE_ID/idea/:IDEA_ID/argument/:ARG_ID`
delete one argument

GET request zijn public, de anderen alleen voor admin en de eigenaar

#### TODO
- Je moet nu member zijn om argumenten te mogen maken. Dat zal ook anomniem moeten kunnen, waarbij hij dan automatisch een gebruiker aanmaakt (ook in mijnopenstad). Aanpassen rolePlay daarop.
- Dit is nog heel simpel en straightforward; je moet dit met de site coonfiguratie kunnen sturen
- Stemmen op argumenen moet nog

## Algemeen TODO
- Error handling loopt nog via de standaards van de monolith. Dat moet anders want ze zijn nu niet in JSON.
- De mijnopenstad config verondersteld een paar urls die nog niet zijn ingericht
- Ik zou graag ASAP de images naar de image server overbrengen
- PUT requests werken nu als PATCH reuqests; dat zou je voor heel netjes een keer uit elkaar moeten trekken




