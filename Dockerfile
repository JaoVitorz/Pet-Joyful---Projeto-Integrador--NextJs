FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de configuração de dentro da pasta pet-joyful
COPY pet-joyful/package*.json ./

RUN npm ci

# Copia todo o conteúdo da pasta pet-joyful para dentro do WORKDIR
COPY pet-joyful/ .

# Agora o build vai encontrar a pasta 'app' que está dentro de 'src'
RUN npm run build

FROM node:20-alpine

WORKDIR /app

# Ajuste os caminhos do COPY --from para onde o Next.js gera o standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]