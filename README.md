# Clinic Management System

A full-stack clinic management system built with TypeScript, Node.js, Express, PostgreSQL, and Next.js.

## Features

- Doctor and service management
- Appointment scheduling with availability checking
- Patient management
- RESTful API with Swagger documentation
- Responsive web interface

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd ts-pern-noscai
```

### 2. Set up environment variables

Copy the example environment file and update the values as needed:

```bash
cp .env.example .env
```

### 3. Start the application with Docker Compose

```bash
docker-compose up --build
```

This will start all services:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/v1
- API Documentation: http://localhost:3000/api-docs
- PostgreSQL: localhost:5432

## Development

### Running locally without Docker

#### Backend

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Set up the database:
   ```bash
   # Start PostgreSQL (or use the Docker container)
   docker-compose up -d db

   # Run migrations
   npm migrate up
   
   # Seed DB
   npm migrate up seed
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

#### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:3001

### API Documentation

API documentation is available at `/v1/api-docs` when the backend is running. This interactive documentation is generated from the JSDoc comments in the controllers.

## Deployment

### Production Build with Docker

1. Build and start the production containers:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

### Environment Variables

Required environment variables are documented in `.env.example`. Make sure to set appropriate values for production.

## Project Structure

```
.
├── backend/               # Backend API server
│   ├── db/                # Database migrations and seeds
│   ├── init/              # Initialization scripts
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database and DTO models
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic
│   └── Dockerfile
│
├── frontend/              # Frontend Next.js application
│   ├── public/            # Static files
│   ├── src/               # Source files
│   └── Dockerfile
│
│
├── docker-compose.yml     # Development Docker Compose
└── .env.example          # Example environment variables
```
