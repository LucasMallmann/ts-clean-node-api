FROM node:14
WORKDIR /usr/src/clean-node-ts-api
COPY package.json .
RUN npm install --only=prod
