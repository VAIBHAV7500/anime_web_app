FROM node:16
WORKDIR /app
COPY . .
WORKDIR /app/backend
RUN npm ci
WORKDIR /app/frontend
RUN npm ci

WORKDIR /app
RUN sh ./build.sh
WORKDIR /app/backend
EXPOSE 8080
CMD ["node", "app.js"]