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

# Install all base dependencies.
RUN apk add --no-cache --update openssl g++ make python musl-dev git

# Set the working directory to the root of the container
WORKDIR /home/app

# Bundle app source
COPY . /home/app

RUN mkdir ~/.ssh ; echo -e "Host github.com\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config

# Install node modules
RUN npm install --loglevel verbose

# Remove unused packages only used for building.
RUN apk del openssl g++ make python && rm -rf /var/cache/apk/*

# Set node ownership to/home/app
RUN chown -R node:node /home/app
USER node

# Mount persistent storage
VOLUME /home/app/data
VOLUME /home/app/public/uploads

# Exposed ports for application
EXPOSE 4444/tcp
EXPOSE 4444/udp


# Run the application
CMD [ "npm", "start" ]
