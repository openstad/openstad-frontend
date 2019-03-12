# An implentation of apostrophecms for Amsterdam open democracy

## Prerequisites
 - [Git](https://git-scm.com/)
 - [Node.js and npm](https://nodejs.org/en/)
 - [Mongodb](https://www.mongodb.com/)


#### 1. Set .env values
```
PORT=3000
#default name of db in mongodb / can leave this
DEFAULT_DB=localhost
#Set to host
DEFAULT_HOST=localhost:3000
APP_URL=http://localhost:3000
API=http://localhost:8108
```

#### 2. Run NPM install

```
npm i
```


#### 3. Create admin user

Run the following command to create a user named admin, belonging to the group admin.

```
node app.js apostrophe-users:add admin admin
```

Then visit your local website. This will trigger a password prompt in your terminal. Set the password.
You can now login to the cms at /login.


#### 3. Run dev server

```
npm run dev
```
