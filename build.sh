#!/bin/bash

sleep 15
mongo default --eval 'db.createUser({user:"ci",pwd:"test",roles:["readWrite"]});'
npm install --production
npm run test -- --coverage
mkdir assets
NODE_ENV=production APOS_MINIFY=1 APOS_WORKFLOW=ON APOS_BUNDLE=assets node apostrophe.js apostrophe:generation --create-bundle assets
docker build -t ${IMAGE_TAG} .
