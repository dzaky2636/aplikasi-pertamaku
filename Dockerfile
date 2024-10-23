FROM node:14-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package.json frontend/pnpm-lock.yaml ./

RUN npm install

COPY frontend/ ./

RUN npm run build

FROM node:14-alpine

WORKDIR /app

COPY backend/package.json backend/pnpm-lock.yaml ./

RUN npm install

COPY backend/ ./

COPY --from=frontend-builder /frontend/dist /app/public

EXPOSE 3000

CMD ["node", "server.js"]
