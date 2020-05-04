FROM alpine:3.9

# ----------------------------------
# Install all base dependencies.
# ----------------------------------
RUN apk add --no-cache --update g++ make python musl-dev nodejs npm

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Bundle app source
COPY . /app

RUN npm install

#create database
#script forcing wait for mysql needs to be set
#RUN node reset.js

# Mount persistent storage

CMD [ "npm", "start" ]
