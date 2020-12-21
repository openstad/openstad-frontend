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

## Travis CI

### GITOPS
Gitops steps:
- Test application
- Generate assets
- Build docker image
- Push docker image
- Commit new image to helm repo (based on GITOPS_RELEASE_BRANCH and GITOPS_{environment}_VALUES_FILE )

If you want to enable gitops flow in the ci pipeline of travis you need to configure a few variables:
- GITOPS=true
- DOCKER_PUBLIC_USERNAME=openstad
- DOCKER_IMAGE_NAME=frontend
- HELM_REPO_NAME=openstad-kubernetes
- HELM_CHART_FOLDER=k8s/openstad
- GITOPS_RELEASE_BRANCH=master
- GITOPS_DEV_VALUES_FILE=k8s/openstad/environments/dev.values.yaml
- GITOPS_ACC_VALUES_FILE=k8s/openstad/environments/acc.values.yaml
- GITOPS_PROD_VALUES_FILE=k8s/openstad/environments/prod.values.yaml
