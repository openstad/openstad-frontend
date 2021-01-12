# Article

## Inhoud
[Inleiding](#inleiding)
[Endpoints](#endpoints)
[ExtraData - zie Idea](/doc/idea#extradata)
[ToDo](#todo)

## Inleiding

Article is een nieuwe resource die vergelijkbaar is met Idea maar daar toch weer los van staat.

Dat wil zeggen:
- een eigen set van routes
- een eigen configuratie
- maar wel met votes en arguments

De drie meest voor de hand liggende oplossingen manieren om dit op te lossen:
1. maak een eigen Article model, in de basis een kopie van Idea, en breid Vote en Argument uit zodat ze met beide om kunnen gaan
2. maak een eigen Article model, en maak er ook eigen een Vote en Argument bij
3. geef Idea een resourceType veld, maak wel eigen routes en configuratie voor article maar gebruik daar gewoon het Ideas model. Misschien moet idea dan hernoemd naar Resource.

Oplossing 1 is flexibel, maar maakt Vote en Argument heel veel complexer.

Oplossing 2 is heel flexibel, relatief eenvoudig, maar betekent dat alle wijzigingen waarschijnlijk op twee plaatsen moeten worden doorgevoerd. Onderhoud wordt dus tamelijk vervelend

Oplossing 3 is veruit het eenvoudigst, maar heeft als belangrijkste nadeel dat er weinig ruimte is wanneer op termijn de functionaliteit van Article en Idea uit elkaar groeit.

Op dit moment zijn votes en args bij articles nog niet nodig. Anderzijds is nog niet 100% duidelijk in welke richting eea. zich gaat bewegen. Daarom zijn articles nu een eigen model, dat is gekopieerd van Idea, maar zonder de votes en args. Hiervandaan zijn alle bovenstaande oplossingen nog goed te implementeren; een definitieve keuze is nog niet gemaakt.

## Endpoints

`GET /api/site/:SITE_ID/article/`
list all articles

`POST /api/site/:SITE_ID/article/`
create an article

`GET /api/site/:SITE_ID/article/:ARTICLE_ID`
view one article

`PUT /api/site/:SITE_ID/article/:ARTICLE_ID`
update one article

`DELETE /api/site/:SITE_ID/article/:ARTICLE_ID`
delete one article

GET request zijn public, POST is alleen toegankelijk voor admin, de anderen alleen voor admin en de eigenaar

Je kunt aan de GETs query parameters meegeven. Die werken als scopes voor Sequelize; dat komt uit de bestaande app. Bestaande scopes zijn:

`includePosterImage`
`includeUser`

## extraData

ExtraData werkt exact hetzelfde als in Idea - [zie daar](/doc/idea#extradata) voor meer informatie

## TODO
- Zie inleiding: maak een keuze voor een definitieve oplossing.