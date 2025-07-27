FROM node:18-alpine
WORKDIR /app

# Instalacja zależności backend
COPY backend/package*.json ./
RUN npm install

# Kopiowanie źródeł backend (z wykluczeniami z .dockerignore)
COPY backend/ ./

# Kopiowanie frontend public (jeśli potrzebne)
COPY frontend/public ./frontend/public

# Kompilacja TypeScript
RUN npx tsc

EXPOSE 3000

# Uruchamianie skompilowanego serwera
CMD ["node", "dist/server.js"] 
