FROM node:20-alpine

RUN npm install -g pnpm@9.0.0

WORKDIR /app

COPY . .

# Instala dependencias (incluye postinstall que genera el cliente Prisma)
RUN pnpm install --no-frozen-lockfile

# Compila el API de NestJS
RUN pnpm --filter api build

EXPOSE 3001

ENV NODE_ENV=production

CMD ["sh", "-c", "cd /app/packages/db && npx prisma migrate deploy --schema=prisma/schema.prisma && cd /app && node apps/api/dist/main"]
