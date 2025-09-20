# Build stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy source code
COPY . .

# Build the application
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]