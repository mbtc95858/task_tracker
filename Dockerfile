FROM node:20-bookworm-slim AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS dev
WORKDIR /app

# 先复制依赖和prisma schema
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# 预生成prisma client
RUN npx prisma generate

ENV NODE_ENV=development
ENV PORT=30000
ENV DATABASE_URL=file:/data/db/dev.db

EXPOSE 30000

# 使用启动脚本，确保每次都重新生成prisma client
CMD ["sh", "-c", "\
mkdir -p /data/db && \
if [ ! -d node_modules/next ]; then npm ci; fi && \
npx prisma generate && \
npx prisma db push && \
npm run dev\
"]
