# Newsletter Signup

Het aanmelden voor niewsbrieven staat alleen open als dat in de siteconfig is opgegeven. De minimale site config is:
```
{
  "config": {
    "newslettersignup": {
      "isActive": true,
      "confirmationEmail": {
        "url": "URL/[[token]]"
      }
    }
  }
}
```

Optionele extra params zijn `autoConfirm` (default false), `confirmationEmail.from`, `confirmationEmail.subject` en `confirmationEmail.template`. Template is een nunjucksTemplate; zie [Email](/doc/email) voor meer informatie.

Ik ga er vanuit dat je bevestigen en afmelden via de frontend doet, en dat daarvandaan een post request naar de API wordt gestuurd. Een directe link naar de API zou ook kunnen met een doorverwijzing naar de frontend; als je dat wilt moet je het even zeggen en bouw ik daar extra endpoints voor.

`GET /api/site/:SITE_ID/newslettersignup`
List all newsletter signups for a site
Query params: confirmed

Alleen beschikbaar voor admins

`POST /api/site/:SITE_ID/newslettersignup`
Create a newslettersignup

Deze staat open voor iedereen. Als je een ingelogde gebruiker bent dan wordt je aanmelding ook direct geconcirmed. Als je niet bent ingelogd dan wordt er een email verstuurd waarmee je moet confirmen.

Als je bent aangemeld zonder ingelogd te zijn, en je dan nog eens aanmeld terwijl je wel bent ingelogd, dan wordt je alsnog geconfirmed.

Voor het confirmen wordt een token gegenereerd. Dat wordt meegegeven in de email.
Ook voor het afmeden wordt een token gegenereerd. Dat zou bij elke verstuurde nieuwsbriief moeten worden toegevoegd, want een afmeldlink is wettelijk verplicht.

`POST /api/site/:SITE_ID/confirm`

Payload:
```
{
  "confirmToken": "TOKEN"
}
```

Bevestig een aanmelding. Open voor iedereen; het token geeft je rechten.


`POST /api/site/:SITE_ID/signout`

Payload:
```
{
  "signoutToken": "TOKEN"
}
```

Meld je af. Open voor iedereen; het token geeft je rechten.


`PUT /api/site/:SITE_ID/newslettersignup/:NEWSLETTERSIGNUP_ID`
Update a newslettersignup

Alleen voor admins

`DELETE /api/site/:SITE_ID/newslettersignup/:NEWSLETTERSIGNUP_ID`
Delete a newslettersignup

Alleen voor admins.

