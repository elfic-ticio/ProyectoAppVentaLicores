FROM node:20-alpine

RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copiar todo el monorepo
COPY . .

# Instalar dependencias (ejecuta postinstall que genera el cliente de Prisma)
RUN pnpm install --frozen-lockfile

# Compilar el API
RUN pnpm --filter api build

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "apps/api/dist/main"]
