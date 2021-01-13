# Email

De API stuurt verschillende typen email.

## E-mail configuratie per site

Het is mogelijk om de transporter methode (SMTP of sendgrid) en de bijbehorende configuratie aan te passen per site.

## Configuratie

Configureren kan via de site.config

### Voor SMTP:
```
{
    "config": {
        "mail": {
            "method": "smtp",
            "transport": {
                "smtp": {
                    "pool": false,
                    "direct": false,
                    "port": 465,
                    "host": "SERVER.ADDRESS",
                    "requireSSL": true,
                    "name": "Mailgun",
                    "auth": {
                        "user": "EMAIL@ADDRESS",
                        "pass": "WACHTWOORD"
                    }
                }            
            }
        }
    }
}
```

### Voor Sendgrid:

```
{
    "config": {
        "mail": {
            "method": "sendgrid",
            "transport": {
                "sendgrid": {
                    "auth": {
                        "api_user": "SENDGRID_USERNAME",                    
                        "api_key": "SENDGRID_PASSWORD",                    
                    }
                }            
            }
        }
    }
}
```

## Feedback bij het insturen van een plan

Bij het aanmaken van een nieuwe inzending krijgt de inzender een email.

#### Configuratie

Configureren kan via de site.config

```
{
  "config": {
    "cms": {
      "url": "URL VAN DE WEBSITE"
    },
    "ideas": {
      "feedbackEmail": {
        "from": "NAAM <EMAIL@ADDRESS>",
        "subject": "ONDERWERP",
        "inzendingPath": "/PATH/NAAR/INGEDIEND/PLAN/[[ideaId]]",
        "template": "Beste {{user.fullName | default('indiener')}},<br/><br/>Bedankt voor je <a href=\"{{inzendingURL}}\">inzending</a>.<br/><br/>Groeten van het Project Team",
        "attachments": [{ filename: "FILENAME1", "cid": "CID1" }, { filename: "FILENAME2", "cid": "CID2" }]
      }
    }
  }
}
```

Template is een nunjucks template - zie later in deze pagina. Daar zijn de volgende variabelen beschikbaar:

**user**: het user object van de inzender
**idea**: het idea object van de nieuwe inzending
**HOSTNAME**: site.config.cms.hostname,
**SITENAME**: site.title,
**URL**: site.config.cms.url,
**EMAIL**: from adres (email only),
**inzendingURL**: site.config.cms.url + site.config.ideas.feedbackEmail.inzendingPath.replace(/\[\[ideaId\]\]/, idea.id),

**TODO**
Misschien een config optie om dit uit te zetten?
Inline images?

## Notificaties

Notificaties worden verstuurd met elk nieuw plan, en periodiek met nieuwe reacties

#### Configuratie

Configureren kan via de site.config

```
{
  "config": {
    "notifications": {
      "from": "NAAM <EMAIL@ADDRESS>",
      "to": "NAAM <EMAIL@ADDRESS>",
      "inzendingPath": "/PATH/NAAR/INGEDIEND/PLAN/[[ideaId]]",
      "template": "{% if data.idea %}{% for idea in data.idea %}{{idea.title}}{% endfor %}{% endif %}{% if data.argument %}{% for arg in data.argument %}{{arg.description | nl2br | safe}}{% endfor %}{% endif %}",
        "attachments": [{ filename: "FILENAME1", "cid": "CID1" }, { filename: "FILENAME2", "cid": "CID2" }]
    }
  }
}
```

Template is een nunjucks template - zie later in deze pagina. Daar zijn de volgende variabelen beschikbaar:

**data.idea**: een array van idea objecten, met de user included, en een **inzendingURL** per idea
**data.argument**: een array van argument objecten, met de user en idea included
**HOSTNAME**: site.config.cms.hostname
**SITENAME**: site.title
**URL**: site.config.cms.url

**TODO**
Misschien een config optie om dit uit te zetten?
Misschien een config optie om de frequentie te bepalen?
configureerbaar?
Subject configureerbaar?
Aparte templates voor ideas en arguments?
Inline images?

## Bevestig een nieuwsbrief aanmedling

Bij het inschrijven voor de nieuwsbrief krijgt de gebruiker een email ter bevestiging. Zie ook [Newsletter Signup](/doc/newslettersignup).

#### Configuratie

```
{
  "config": {
    "newslettersignup": {
      "isActive": true,
      "confirmationEmail": {
        "url": "URL/[[token]]",
        "from": "NAAM <EMAIL@ADDRESS>",
        "subject": "ONDERWERP",
        "template": "Klik op de link om te bevestigen: {{confirmationUrl}}",
        "attachments": [{ filename: "FILENAME1", "cid": "CID1" }, { filename: "FILENAME2", "cid": "CID2" }]
      }
    }
  }
}

```

Template is een nunjucks template - zie later in deze pagina. Daar zijn de volgende variabelen beschikbaar:

**HOSTNAME**: site.config.cms.hostname
**SITENAME**: site.title
**URL**: site.config.cms.url
**EMAIL**: from adres (email only),
**confirmationUrl**: de url waarop iemand kan bevestigen

Ik ga er vanuit dat je bevestigen en afmelden via de frontend doet, en dat daarvandaan een post request naar de API wordt gestuurd. Een directe link naar de API zou ook kunnen met een doorverwijzing naar de frontend; als je dat wilt moet je het even zeggen en bouw ik daar extra endpoints voor.

## Nunjucks templates

De email wordt opgemaakt met nunjucks; alle beschreven vars kunnen dus met nujucks syntax worden geinclude.
Daarnaast kun je naar attachments verwijzen. Die worden verondersteld in de dir INSTALLDIR/email/uploads/ te staan.

**TODO**

Er is nog geen upload mechanisme; momenteel moet je attachments met de hand in de uploads dir plaatsen.

