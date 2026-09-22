FROM node:20-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

# The downloader invokes wget directly, so it must exist in the runtime image.
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates wget \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .
RUN mkdir -p downloads && chown -R node:node /app
USER node

ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
