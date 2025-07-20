FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/. .
COPY frontend/public ./frontend/public
EXPOSE 3000
CMD ["node", "server.js"] 
