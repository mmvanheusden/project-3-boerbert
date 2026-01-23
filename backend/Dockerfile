# Dockerfile (dev)
FROM oven/bun:latest

WORKDIR /app

# Install all deps (including dev)
COPY package.json bun.lock ./
RUN bun install

# Copy source (but NOT the public folder – it will be mounted)
COPY src ./src

EXPOSE 3000
CMD ["bun", "run", "src/index.ts"]