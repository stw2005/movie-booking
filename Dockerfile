# Build Stage for Frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Production Stage
FROM node:22-alpine
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source code
COPY backend/ ./

# Copy built frontend assets from the build stage
COPY --from=frontend-build /app/frontend/dist ./dist

# Create directory for SQLite database if it doesn't exist
# (Note: For production, consider using a persistent volume or an external database)
RUN mkdir -p uploads

EXPOSE 10000

# Start the server
CMD ["node", "server.js"]
