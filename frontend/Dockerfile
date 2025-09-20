# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .
EXPOSE 8080

# Start Nginx
CMD ["npm", "run", "dev"]
