FROM node:20-alpine3.22 AS builder

WORKDIR /build

COPY server/package*.json ./

RUN npm ci \
    && npm cache clean --force

COPY server/. .

RUN npm run build

FROM node:20-alpine3.22

WORKDIR /app

COPY --from=builder /build/package*.json ./
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/src/resources/proxy_caller.wasm ./dist/resources/proxy_caller.wasm

CMD ["node", "./dist/api.js"]
