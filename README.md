# openstad-api

Dit is voor nu een kaalgeslagen versie van de json-api branch van de openstad-monolith

Stap 0: neem de monolith en gooi alles weg wat je niet nodig hebt

Wijzigingen, naast het verwijderen van pnnodige code:
- Sequelize geupdate van v3 naar v5
- nunjucks wordt alleen nog voor emails gebruikt en is daarom verhuisd naar mail.js
- email functies verhuis naar mail.js als sendNotificationMail() en sendThankYouMail();

