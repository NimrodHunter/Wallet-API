FROM node:carbon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock /usr/src/app/
RUN yarn install --pure-lockfile

# Bundle app source
COPY . /usr/src/app

# Create volume for certificates
RUN mkdir -p /usr/src/app/certificates
VOLUME /usr/src/app/certificates

# Create volume for wallet
RUN mkdir -p /usr/src/app/.wallet
VOLUME /usr/src/app/.wallet

EXPOSE 8080

CMD [ "yarn", "start" ]
