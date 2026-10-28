FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["pnpm", "exec", "tsx", "src/app.ts"]