FROM alpine:3.9

# ----------------------------------
# Install all base dependencies.
# ----------------------------------
RUN apk add --no-cache --update openssl g++ make python musl-dev nodejs npm

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Bundle app source
COPY . /app
RUN npm install

# Mount persistent storage
VOLUME /app/data
VOLUME /app/public/uploads

EXPOSE 3000
CMD [ "npm", "start" ]
