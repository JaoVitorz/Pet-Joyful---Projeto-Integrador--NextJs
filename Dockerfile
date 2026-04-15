# Estágio 1: Dependências
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia apenas os arquivos de pacotes para aproveitar o cache do Docker
# Como o lockfile está em pet-joyful/, copiamos de lá
COPY pet-joyful/package*.json ./
RUN npm ci

# Estágio 2: Build do projeto
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# Copia todo o conteúdo da pasta pet-joyful
COPY pet-joyful/ .

# Desativa a coleta de dados do Next.js durante o build
ENV NEXT_TELEMETRY_DISABLED=1

# Executa o build (lembrando que o next.config.ts deve ter output: 'standalone')
RUN npm run build

# Estágio 3: Runner (Imagem final)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Cria um usuário do sistema para não rodar como root (melhor prática de segurança)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia os arquivos necessários do estágio de build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# Define que o servidor deve escutar em todas as interfaces de rede
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]