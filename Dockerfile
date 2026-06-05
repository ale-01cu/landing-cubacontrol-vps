# ==========================================
# ETAPA 1: Construcción (Builder)
# ==========================================
FROM node:24.14.1-slim AS builder

# Habilitar pnpm mediante corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# 1. Copiar solo los archivos de dependencias primero. 
# Esto hace que Docker guarde en caché las dependencias y el build sea MUCHO más rápido
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2. Copiar el resto del código del proyecto
COPY . .

# 3. Solucionador de problemas de Red en Docker Desktop (Forzar IPv4)
ENV NODE_OPTIONS="--dns-result-order=ipv4first --max-old-space-size=4096"

# 4. Construir el proyecto de Nuxt
RUN pnpm run build

# ==========================================
# ETAPA 2: Producción (Runner)
# ==========================================
FROM node:24.14.1-slim

WORKDIR /app

# Copiar UNICAMENTE la carpeta compilada (.output) desde la Etapa 1
COPY --from=builder /app/.output ./

# Variables de entorno para Nuxt en producción
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Exponer el puerto
EXPOSE 3000

# Iniciar el servidor de Nuxt Nitro
CMD ["node", "server/index.mjs"]