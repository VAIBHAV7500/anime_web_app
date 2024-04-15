FROM node:20-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 4200

CMD ["node", "app.js"]

