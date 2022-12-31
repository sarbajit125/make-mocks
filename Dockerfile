FROM node:lts as dependencies
WORKDIR /make-mocksUI
COPY package.json ./
RUN npm install
COPY ./

# Building app
RUN npm run build
EXPOSE 8080

# Running the app
CMD ["npm", "run", "dev"]