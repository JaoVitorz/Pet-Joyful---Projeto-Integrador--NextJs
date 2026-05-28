# =========================
# ESTÁGIO 1 — Dependências
# =========================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copia package.json e package-lock.json da raiz
COPY package*.json ./

# Instala dependências
RUN npm ci


# =========================
# ESTÁGIO 2 — Build
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copia node_modules do estágio anterior
COPY --from=deps /app/node_modules ./node_modules

# Copia todo projeto
COPY . .

# Build do Next.js
RUN npm run build


# =========================
# ESTÁGIO 3 — Runner
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia arquivos necessários
COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]