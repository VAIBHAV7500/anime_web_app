FROM node:20-alpine as frontend-builder

RUN apk app update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /app

COPY ./frontend/ .

RUN npm install --silent

RUN npm install react-scripts@3.4.1 -g --silent

RUN npm run build



FROM node:20-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /app

COPY ./backend/ .
COPY --from=frontend-builder /app/build ./build

RUN npm ci

EXPOSE 4200
CMD ["node", "app.js"]
