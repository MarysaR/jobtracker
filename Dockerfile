FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package.json
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY backend/ ./

# Générer Prisma client
RUN npx prisma generate

# Build du TypeScript
RUN npm run build

# Exposer le port
EXPOSE 3000

# Script de démarrage qui lance les migrations puis l'app
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]