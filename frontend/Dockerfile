# BUILD
FROM node:24-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=backend . ../backend
RUN npm ci
RUN npm run build

# SERVE
FROM caddy:alpine
COPY --from=builder /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /usr/share/caddy
