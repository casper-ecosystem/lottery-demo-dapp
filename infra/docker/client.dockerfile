FROM public.ecr.aws/docker/library/node:18-alpine3.18 as builder

WORKDIR /app/builder

COPY client/package*.json ./

RUN npm ci --force \
    && npm cache clean --force

COPY client/. .

RUN npm run build

FROM public.ecr.aws/nginx/nginx:1.22.0

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/builder/build ./
COPY --from=builder /app/builder/public/config.js.template ./config.js.template
COPY infra/docker/client-nginx/nginx.conf /etc/nginx/nginx.conf
COPY infra/docker/client-nginx//100-build-env-specific-assets.sh /docker-entrypoint.d
