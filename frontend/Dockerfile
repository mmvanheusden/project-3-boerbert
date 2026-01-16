# BUILD
FROM node:24-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=backend . ../backend

# First pull backend dependencies, else we can't use the backend in frontend.
RUN npm install -g bun
RUN cd ../backend && bun install && cd --

RUN npm ci
RUN npm run build

# SERVE
FROM caddy:alpine
COPY --from=builder /app/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /usr/share/caddy
