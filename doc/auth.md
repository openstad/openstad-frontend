# Authentication and Authorization

## Login

```GET /oauth/login```
en 
```GET /oauth/site/:SITE_ID/login```

Als je een site meestuurt dan haalt hij die site op en gebruikt de oauth config settings daarvan (waar gedefinieerd; zie onder Site) in plaats van de opties in de local.json config.

Hij logt de gebruiker in als gewone, lokale, monolith user, en vanaf daar werkt dat als verwacht. Die user wordt zonodig aangemaakt.
Voor nu ga ik er vanuit dat de required fields email, firstName, lastName en postcode beschikbaar zijn in mijnopenstad, net als de rol. Deze data wordt bij elke login geupdate.

Hij redirect naar site.config.cms['after-login-redirect-uri'] of req.site.config.oauth['after-login-redirect-uri'] of authorization['after-login-redirect-uri'] uit de local.json

Die redirect url zou `[[JWT]]` moeten bevatten. Op die plek wordt je JWT toegevoegd.

Met die JWT kun je ook API calls doen. Die moet je meesturen als header:
```X-Authorization: Bearer JWT```

Dat heet `X-Authorization` omdat hij anders botst met de basic authentication

```GET /oauth/me```
en 
```GET /oauth/site/:SITE_ID/me```

Get the user for this JWT. Site ID wordt niet gebruikt maar de route bestaat wegens consistent.

Een alternatieve login kan worden geconfigureerd in /config/local.json:
```"authorization": {
  ...
  "fixed-auth-tokens": [
    {
      "token": "123",
      "userId": "2"
    }
  ]
}
```

Ook deze kan meegestuurd als authorization header:
```X-Authorization: 123```

Hij logt dan automatisch de gebruiker met het geconfigireerde userId in. Dit is naturlijk een potientieel security gat. Met andere woorden: het token moet zorgvuldig worden behandeld.



#### TODO
- rollen moeten per site
- flexibiliteit mbt. tot velden in mijnopenstad versus lokaal
- per site inloggen; je logt nu in op alles
- server crashed momenteel op /oauth/login zonder :SITE_ID
- rename X-Authorization
