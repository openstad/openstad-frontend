# Email

De API stuurt verschillende typen email.

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
        "template": "Beste {{user.fullName | default('indiener')}},<br/><br/>Bedankt voor je <a href=\"{{inzendingURL}}\">inzending</a>.<br/><br/>Groeten van het Project Team"
      }
    }
  }
}
```

Template is een nunjucks template. Daar zijn de volgende variabelen beschikbaar:

**user**: het user object van de inzender
**idea**: het idea object van de nieuwe inzending
**HOSTNAME**: site.config.cms.hostname,
**SITENAME**: site.title,
**URL**: site.config.cms.url,
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
      "template": "{% if data.idea %}{% for idea in data.idea %}{{idea.title}}{% endfor %}{% endif %}{% if data.argument %}{% for arg in data.argument %}{{arg.description | nl2br | safe}}{% endfor %}{% endif %}"
    }
  }
}
```

Template is een nunjucks template. Daar zijn de volgende variabelen beschikbaar:

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

