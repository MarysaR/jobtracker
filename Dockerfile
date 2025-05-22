FROM node:18-alpine

WORKDIR /app

# Copier les fichiers du backend
COPY backend/package*.json ./
RUN npm install

COPY backend/ ./

# Build du TypeScript
RUN npm run build

# Exposer le port
EXPOSE 3000

# Démarrer l'app
CMD ["npm", "start"]