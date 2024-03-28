FROM node:20.12.0-alpine3.18 as builder

WORKDIR /build

COPY server/package*.json ./

RUN npm ci \
    && npm cache clean --force

COPY server/. .

RUN npm run build

FROM node:20.12.0-alpine3.18

WORKDIR /app

COPY --from=builder /build/package*.json ./
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules

CMD ["node", "./dist/event-handler.js"]
