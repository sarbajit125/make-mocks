# FROM node:lts As development

# WORKDIR /usr/src/makeMocks

# COPY package*.json ./

# RUN npm install --only=development

# COPY . .

# RUN npm run build

# EXPOSE 8080

# CMD ["npm", "run", "start:dev"]

# Stage 1: install dependencies
FROM node:lts As development
WORKDIR /usr/src/makeMocks
COPY package*.json .
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
RUN npm install

# Stage 2: build
FROM node:lts AS builder
WORKDIR /usr/src/makeMocks
COPY . .
RUN npm run build

# Stage 3: run
FROM node:lts
WORKDIR /usr/src/makeMocks
COPY --from=builder /usr/src/makeMocks/.next ./.next
COPY --from=builder /usr/src/makeMocks/public ./public
COPY --from=builder /usr/src/makeMocks/node_modules ./node_modules
COPY --from=builder /usr/src/makeMocks/package.json ./
CMD ["npm", "run", "start"]