FROM node:24.13-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

USER root
RUN set -x \
    && apk update \
    && apk upgrade

WORKDIR /app
COPY . .

RUN pnpm install
RUN pnpm build


FROM node:24.13-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate
RUN apk update && apk add --no-cache openssl

USER root
RUN set -x \
    && apk update \
    && apk upgrade 

WORKDIR /app

COPY --from=builder /app/entrypoint.sh /usr/local/bin/entrypoint.sh 
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY --from=builder /app/package.json package.json
COPY --from=builder /app/dist dist
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/seeders seeders
COPY --from=builder /app/migrations migrations
COPY --from=builder /app/config config



RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app/node_modules

USER appuser

EXPOSE 3000
ENTRYPOINT ["entrypoint.sh"]
CMD ["pnpm", "start:prod"]
