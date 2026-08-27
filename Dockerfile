# =====================================================
# Wolaita Sodo Water-Point Monitoring System - Docker
# Multi-stage build: React client + Express server
# =====================================================

# ---- Stage 1: Build React client ----
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci || npm install
COPY client/ ./
RUN npm run build

# ---- Stage 2: Server runtime ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY server/ ./server/
COPY --from=client-build /app/client/build ./client/build

RUN mkdir -p uploads

EXPOSE 8000

CMD ["node", "server/server.js"]