FROM node:alpine AS development

WORKDIR /blueprints-service/src/app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /blueprints-service/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

COPY --from=development /blueprints-service/src/app/dist ./dist

CMD ["node", "dist/main"]
