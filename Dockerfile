# syntax=docker/dockerfile:1

ARG NODE_VERSION=20

# 1. Install dependencies and build
FROM node:${NODE_VERSION}-alpine AS deps

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2. Final lightweight runtime image
FROM node:${NODE_VERSION}-alpine AS final

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy only what’s needed to run the app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/.next ./.next
COPY --from=deps /usr/src/app/public ./public
COPY --from=deps /usr/src/app/package.json ./package.json
COPY --from=deps /usr/src/app/next.config.mjs ./next.config.mjs
COPY --from=deps /usr/src/app/tsconfig.json ./tsconfig.json

USER node

EXPOSE 3000

CMD ["npm", "start"]