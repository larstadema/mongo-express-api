# ---------- Base ----------
FROM node:12-alpine AS base

WORKDIR /usr/src/app

RUN chown -R node:node /usr/src/app

# ---------- Builder ----------
FROM base AS builder

WORKDIR /usr/src/app

COPY package*.json .babelrc.js ./

RUN apk add curl bash

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

## Install build toolchain, install node deps and compile native add-ons
RUN apk --no-cache add --virtual native-deps \
  build-base python && \
  npm install --quiet node-gyp -g && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del native-deps

COPY --chown=node:node . .

RUN npm run build

RUN npm prune --production # Remove dev dependencies

# run node prune
RUN /usr/local/bin/node-prune
# ---------- Release ----------
FROM base AS release

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Copy the compiled app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/build ./build

# container exposed network port number
EXPOSE 3000

# Production
RUN npm install -g pm2

USER node

# COPY --chown=node:node . .

CMD ["pm2-runtime", "pm2.config.js", "--env", "production"]
