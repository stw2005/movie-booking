FROM node:18-alpine

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install deps INSIDE the container (Linux build)
RUN npm install

# Now copy source code (without node_modules)
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
