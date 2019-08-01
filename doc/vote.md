# Vote

`GET /api/site/:SITE_ID/vote`
List all votes for a site
Query params: ideaId, userId, opinion

`POST /api/site/:SITE_ID/vote`
Create or update votes

opinion is optioneel

Voor voteType 'count' or 'budgeting' vervangt de nieuwe stem de oude, over multiple records dus.
Alleen als dat mag, natuurlijk. Zie `config.votes.withExisting`.

voteType 'likes' werkt als een toggle: stuur je een stem op die al bestaat da wordt die verwijderd. Dit is backwards compatible met stemvan.

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

of 1 stem:
```
{
  "ideaId": 7,
  "opinion": "yes"
}
```

**TODO**
Er moet  nog een eindpunt komen voor het confirmen van votes

## Configuratie

We hebben momenteel:
- stemvan stemmen: je kunt op elk open plan een voor of tegen stem uitbrengen. Nog een keer stemmen vervangt of annuleert de oude.
- westbegroot/molenwijk: in principe hetzelfde, maar dan in bulk. Je kunt bovendien niet meer wijzigen.
- javabrug: ook in bulk, maar je kunt nog wel wijzigen
- kareldoorman en kademuren: max 1 stem, die je nog kunt wijzigen
- eberhard: max 1 stem, die je bovendien moet bevestigen

Om dat te facliteren bestaan de volgende settings in de site configuratie (de eerste waarde is steeds de default):

#### isViewable: false | true

Mag het stem resultaat worden getoond.

#### isActiveFrom: "ISODate" en isActiveTo: "ISODate"

Van waneer tot waneer kan er gestemd worden. Buiten deze data is het stemmen gesloten.
De waarde van isActive overruled dit. Anders gezegd: dit werkt alleen als isActive null is.

#### isActive: null | false | true

Kan er gestemd worden. Deze parameter overruled de from-to dates hierboven.

#### requiredUserRole: "member" | "anonymous"

'anonymous' is de stemvan variant: we willen van gebruikers alleen een postcode weten. Deze variant is nog niet geimplementeerd.

#### mustConfirm: false | true

Nog niet geimplementeerd

De stem van een gebruiker is pas geldig als die is bevestigd via email.

#### withExisting: "error" | "replace"

Als een gebruiker die stemt al eens eerder heeft gestemd dan kan zijn stem worden overschreven of er kan een error worden gegenererd

Deze config var heeft geen invloed op voteType 'likes'.

#### voteType: 'likes' | 'count' | 'budgeting'

voteTypes 'budgeting' en 'count' komen uit westbegroot en molenwijk
'likes' is de variant voor stemvan

#### maxIdeas, minIdeas, minBudget, maxBudget

Deze waarden gelden bij voteType 'count' resp. 'budgeting', en bepalen de marges voor de ingebrachte stem.

#### Voorbeeld configuraties

Westbegroot ideeenfase
```
{
	"isActive": true,
	"voteType": "likes",
	"isViewable": true,
	"withExisting": "replace",
}
```

Westbegroot stemfase
```
{
	"isActive": true,
	"voteType": "budgeting",
	"minBudget": 200000,
	"maxBudget": 300000,
	"withExisting": "error"
}
```

Molenwijk
```
{
	"isActive": true,
	"voteType": "count",
	"maxIdeas": 5,
	"minIdeas": 4,
	"withExisting": "error"
}
```

Zorg goed voor onze stad
```
{
  "isViewable": true,
	"isActive": true,
	"voteType": "count",
	"maxIdeas": 1,
	"minIdeas": 1,
	"withExisting": "replace",
	"mustConfirm": true
}
```

**TODO**
create User on vote?
confirmation
Je kun nu ook meerdere likes tegelijk opsturen. Misschien is dat niet wenselijk. Wellicht een config param?
