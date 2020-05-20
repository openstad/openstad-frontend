# An implementation of @openstad/cms for open democracy

## Prerequisites
 - [Git](https://git-scm.com/)
 - [Node.js and npm](https://nodejs.org/en/)
 - [Mongodb](https://www.mongodb.com/)


#### 1. Set .env values
copy .env.example to .env and configure the env values

#### 2. Run NPM install

```
npm i
```

#### 3. Use npm link for local development
- `cd packages/cms`
- `npm link`
- `cd ../../`
- `npm link @openstad/cms`

For more information about the @openstad/cms package see this [readme](packages/cms/README.md)
