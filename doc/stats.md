# Stats

## Beschrijving

Endpoints voor numerieke informatie

Dit gebruikt directe queries op de DB, dus zonder sequelize.

## Endpoints

### Ideas

```
GET :HOSTNAME/stats/site/:SITE_ID/idea/total
```

Aantal ideeen.


### Votes

Alleen zichtbaar als `site.config.votes.isViewable` waar is. Of als je admin bent.

```
GET :HOSTNAME/stats/site/:SITE_ID/vote/total
GET :HOSTNAME/stats/site/:SITE_ID/vote/total?opionion=yes
```

Aantal stemmen.


```
GET :HOSTNAME/stats/site/:SITE_ID/vote/no-of-users
```

Aantal gebruikers dat heeft gestemd.
