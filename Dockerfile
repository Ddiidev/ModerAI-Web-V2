# Multi-stage build para otimizar o tamanho da imagem final
FROM oven/bun:latest AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json bun.lock* ./

# Instalar dependências
RUN bun install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação para produção (estático para SEO)
RUN bun run build

# Estágio final - imagem mínima para servir a aplicação
FROM oven/bun:alpine AS runner

# Instalar dependências mínimas
RUN apk --no-cache add ca-certificates

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S moderai && \
    adduser -S moderai -u 1001 -G moderai

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários do estágio de build
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env

# Mudar para usuário não-root
USER moderai

# Expor a porta do frontend
EXPOSE 4200

# Definir variáveis de ambiente
ENV BUN_THREADS=4
ENV PORT=4200
ENV NODE_ENV=production
ENV AUTH_TRUST_HOST=true

# Comando para executar a aplicação
CMD ["bun", "./build/index.js"]