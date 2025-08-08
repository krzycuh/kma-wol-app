# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Instalacja zależności (wszystkie, w tym devDependencies)
COPY backend/package*.json ./
RUN npm install

# Kopiowanie plików potrzebnych do kompilacji
COPY backend/tsconfig.json ./
COPY backend/src/ ./src/

# Kompilacja TypeScript
RUN npx tsc

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app

# Instalacja tylko zależności produkcyjnych (z buildera)
COPY --from=builder /app/package*.json ./
RUN npm install --only=production

# Kopiowanie skompilowanych plików z buildera
COPY --from=builder /app/dist ./backend

# Kopiowanie frontend public (z hosta - to OK)
COPY frontend/dist ./frontend/dist

# Port jest konfigurowalny przez zmienną środowiskową PORT
# Domyślnie: 3000
# Przykład: docker run -e PORT=8080 -p 8080:8080 kma-wol-app
EXPOSE 3000

# Ustawienie ścieżki do public directory
# Używane w config/index.ts
# ponieważ w kontenerze katalogiem roboczym jest /app/, a nie /app/backend
ENV NODE_CWD=/app/backend

CMD ["node", "backend/server.js"]
