import { serve, setup } from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerDocument } from './swagger';
import type { Express } from 'express';
import path from 'path';
import fs from 'fs';

// Function to recursively get all TypeScript files in a directory
function getTsFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Get all controller files
// @ts-ignore
const controllersPath = path.join(import.meta.dirname, '../controllers');
const apiFiles = getTsFiles(controllersPath);

// Swagger options
const options: swaggerJsdoc.Options = {
  definition: swaggerDocument,
  // Paths to files containing OpenAPI definitions
  apis: [...apiFiles, './src/models/**/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express, basePath = '/api-docs') => {
  // Serve Swagger UI
  app.use(basePath, serve, setup(specs, { explorer: true }));

  // Serve Swagger JSON
  app.get(`${basePath}.json`, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log(`📚 API Documentation available at http://localhost:${process.env.PORT || 3000}${basePath}`);
};

export default setupSwagger;
