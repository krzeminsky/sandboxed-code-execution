FROM node:24-alpine

RUN apk add --no-cache \
    docker-cli \
    bash

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build -- --mode prod

CMD ["node", "./build/index.js"]