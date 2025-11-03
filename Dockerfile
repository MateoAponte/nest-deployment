# ---------- Base de deps ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---------- Build ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Runner (final) ----------
FROM node:20-alpine AS runner
WORKDIR /app

# Certificados para SSL (Neon exige sslmode=require)
RUN apk add --no-cache ca-certificates dumb-init
ENV NODE_ENV=production
ENV PORT=3000

# Copiamos solo lo necesario
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Usuario no root por seguridad
RUN adduser -D appuser
USER appuser

EXPOSE 3000
CMD ["dumb-init","node","dist/main.js"]
