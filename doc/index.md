# Algemeen

Dit is een JSON API server

## Inhoud
[Login](/doc/auth)
[Site](/doc/site)
[Idea](/doc/idea)
[Argument](/doc/argument)
[Vote](/doc/vote)
[Article](/doc/article)
[Poll](/doc/poll)
[Email](/doc/email)
[Newsletter Signup](/doc/newslettersignup)

[Sequelize authorization](/doc/sequelize-authorization)
[Pagineren en zoeken](/doc/pagination-and-search)

[Stats](/doc/stats)

## Roadmap. Of: een paar lange termijn ToDo's

- users zouden uit de API moeten en opgehaald uit de oauth server. Maar dan moeten we iets hebbben om waarden in ideas, argumenten etc. te vullen.
  de user API is dan meer een microservice 'user'. Daarvandaan kun je ook nieuwe logins via externe oauths of digid of whatever toevoegen.
- refactor arguments naar reactions
- opspliten in kleinere API's
- maak een API event server waar andere onderdelen naar kunnen luisteren
- betere error handling
- i18n




