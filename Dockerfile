# frontend stage
FROM node:18-alpine AS frontend

WORKDIR /app/frontend

COPY frontend/package.json frontend/pnpm-lock.yaml ./

RUN npm install && npm install -g pnpm && pnpm install

COPY frontend/ .

RUN pnpm run build

# backend stage
FROM node:18-alpine AS backend

WORKDIR /app/backend

COPY backend/package.json backend/pnpm-lock.yaml ./

RUN npm install && npm install -g pnpm && pnpm install

COPY backend/ .

COPY --from=frontend /usr/src/frontend/dist ./public

EXPOSE 3001 
EXPOSE 3000 
# 3001 is front, 3000 is back

ENV VITE_USER_NAME=$VITE_USER_NAME

# Start the backend server
CMD ["pnpm", "start"]