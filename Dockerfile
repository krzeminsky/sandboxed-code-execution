FROM node:24-alpine

RUN apk add --no-cache \
    docker-cli \
    bash

WORKDIR /app

COPY . .

RUN npm ci && \
    npm run build -- --mode prod && \
    npm cache clean --force && \
    rm -rf /root/.npm && \
    rm -rf node_modules \
    rm -rf src \
    rm -rf static

CMD ["node", "./build/index.js"]