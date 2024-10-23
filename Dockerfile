FROM node:18-alpine

WORKDIR /app/backend

COPY backend/package.json backend/pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY backend/ .

WORKDIR /app/frontend

COPY frontend/package.json frontend/pnpm-lock.yaml ./

RUN pnpm install

COPY frontend/ .

RUN pnpm run build

RUN cp -r dist/* ../frontend/public

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "server.js"]
