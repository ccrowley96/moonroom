# Prod docker config
FROM node as build

ENV NODE_ENV=prod

# Set up and build client

WORKDIR /app/client

COPY ./client/package*.json ./

RUN npm ci --only=production

ENV PATH="./node_modules/.bin:$PATH"

COPY ./client ./

RUN npm run build

# Set up server

FROM node:latest

WORKDIR /app/server

COPY server/package*.json ./

RUN npm ci --only=production

ENV PATH="./node_modules/.bin:$PATH"

COPY ./server ./

RUN npm run build

COPY --from=build /app/client/build /app/server/dist/client_build

EXPOSE 5000

CMD ["node", "dist/index.js"]