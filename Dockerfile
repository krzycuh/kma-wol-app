FROM node:18-alpine
WORKDIR /app

# Instalacja zależności
COPY backend/package*.json ./
RUN npm install

# Kopiowanie źródeł
COPY backend/. .
COPY frontend/public ./frontend/public

# Kompilacja TypeScript
RUN npx tsc

EXPOSE 3000

# Uruchamianie skompilowanego serwera
CMD ["node", "dist/server.js"] 
