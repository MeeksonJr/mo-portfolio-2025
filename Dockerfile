# syntax=docker/dockerfile:1.6
ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS base
ENV CI=true
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; else pnpm install; fi

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN if [ -f pnpm-lock.yaml ]; then pnpm build; else npm run build; fi

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --prod --frozen-lockfile; else npm ci --omit=dev; fi
EXPOSE 3000
CMD ["sh","-c","if [ -f pnpm-lock.yaml ]; then pnpm start; else npm start; fi"]
