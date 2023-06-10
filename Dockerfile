# FROM node:18-alpine

# WORKDIR /home/frontend

# # Install dependencies based on the preferred package manager
# COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* /home/frontend/
# RUN \
#     if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#     elif [ -f package-lock.json ]; then npm ci; \
#     elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
#     else echo "Lockfile not found." && exit 1; \
#     fi

# COPY . /home/frontend/

# CMD npm run dev
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD npm run dev