# Nodejs 8.0.0 alpine 3.6.0
FROM node:13.14.0-alpine

# Label for tracking
LABEL nl.openstad.container="frontend" nl.openstad.version="0.0.1-beta" nl.openstad.release-date="2020-05-07"

# Frontend container name
ENV DEFAULT_HOST=""

# frontend url + port `example.com:port`
ENV HOST_DOMAIN=""

# full url `http://example.com:port`
ENV APP_URL=""
ENV PORT="4444"

# `AUTH_FIXED_TOKEN` for auth container
ENV SITE_API_KEY=""

# Full api address `http://example.com:port`
ENV API=""

# MongoDB credentials
ENV MONGO_DB_HOST=""
ENV DB_HOST=""
ENV DEFAULT_DB=""

ENV APOS_BUNDLE="assets"
ENV NODE_ENV="production"

ENV S3_ENDPOINT=""
ENV S3_KEY=""
ENV S3_SECRET=""
ENV S3_BUCKET=""


# Install all base dependencies.
RUN apk add --no-cache --update openssl g++ make python musl-dev git bash


# Set the working directory to the root of the container
WORKDIR /home/app

# Bundle app source
COPY --chown=node:node . /home/app

#RUN cp -r ./packages/cms/test test

RUN mkdir ~/.ssh ; echo -e "Host github.com\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config

# Install node modules
RUN npm install --loglevel warn --production

RUN npm install -g nodemon

# Remove unused packages only used for building.
RUN apk del openssl g++ make python && rm -rf /var/cache/apk/*

RUN mkdir -p /home/app/public
RUN mkdir -p /home/app/public
RUN mkdir -p /home/app/public/modules
RUN mkdir -p /home/app/public/css
RUN mkdir -p /home/app/public/js
RUN mkdir -p /home/app/public/img
RUN mkdir -p /home/app/public/apos-minified
RUN mkdir -p /home/app/data

# Mount persistent storage
#VOLUME /home/app/data
VOLUME /home/app/public/uploads
RUN mkdir -p /home/app/public/uploads/assets

# Set node ownership to/home/app
# only run CHOWN on dirs just created
# the copy command created the proper rights
# otherwise takes very long
RUN chown -R node:node /home/app/public
RUN chown -R node:node /home/app/data
USER node

# Exposed ports for application
EXPOSE 4444/tcp
EXPOSE 4444/udp


# Run the application
CMD [ "npm", "start" ]
