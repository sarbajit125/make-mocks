FROM node:lts As development

WORKDIR /usr/src/makeMocks

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:lts As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/makeMocks

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/makeMocks/dist ./dist

EXPOSE 8080

CMD ["node", "dist/main"]