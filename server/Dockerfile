FROM node:19-alpine as base

WORKDIR /usr/src/app
COPY ./package*.json .

RUN npm install
COPY . .



FROM base as production

ENV NODE_PATH=./build

RUN npm run build