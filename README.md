# openstad-api

## Setup

### 1. Installatie
```
git@github.com:Amsterdam/openstad-api.git
cd openstad-api
npm i
```

### 2. Maak een lokale configuratie file `./config/local.js`
```
module.exports = {

  "url": "URL",
  "hostname": "DOMAIN",

  "database": {
    "user": "DB_USERNAME",
    "password": "DB_PASSWORD",
    "database": "DB_NAME",
    "host": "DB_HOST",
    "dialect": "DB_DIALECT",
    "multipleStatements": true
  },

  "express": {
    "port": PORT
  },

  "mail": {
    "from": "EMAIL_ADDRESS",
    "transport": {
      "smtp": {
        "port": SMTP_PORT,
        "host": "SMTP_HOST",
        "auth": {
          "user": "SMTP_USERNAME",
          "pass": "SMTP_PASSWORD"
        }
      }
    }
  },

  "security": {
    "sessions": {
      "secret": "COOKIE_SECRET",
      "onlySecure": true
    }
  },

  "authorization": {
    "jwt-secret": "MIJNOPENSTAD_JWT_SECRET",
    "auth-server-url": "MIJNOPENSTAD_URL",
    "auth-client-id": "MIJNOPENSTAD_DEFAULT_CLIENT_ID",
    "auth-client-secret": "MIJNOPENSTAD__CLIENT_PASSWORD",
    "auth-server-login-path": "/dialog/authorize?redirect_uri=[[redirectUrl]]&response_type=code&client_id=[[clientId]]&scope=offline",
    "auth-server-exchange-code-path": "/oauth/token",
    "auth-server-get-user-path": "/api/userinfo?client_id=[[clientId]]",
    "auth-server-logout-path": "/logout?clientId=[[clientId]]",
    "after-login-redirect-uri": "/?jwt=[[jwt]]",
    "fixed-auth-tokens": [
      {
        "token": "12345",
        "userId": "2"
      }
    ]
  }
}
```

### 3. Initeëer de database
```
node reset.js
```

### 4. Start de server
```
node server.js
```

## Documentatie

Meer informatie staat in de [docs directory](doc/index.md).
