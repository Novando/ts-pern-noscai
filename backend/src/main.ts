import express from 'express'
import cors from 'cors'
import {Logger} from "./utils/logger.util";
import {envConfig} from "./configs/config.config";
import {startRest} from "./bootstraps/rest.bootstrap";
import { defaultStorageMiddleware } from "./middlewares/default-storage.middleware";
import {requestLoggerMiddleware} from "./middlewares/request-logger.middleware";
import { setupSwagger } from './config/swagger-ui';

async function main () {
  Logger.init('./log/logfile')

  // Init REST API
  const app = express()
  const bootstrapRest = await startRest()

  app.use(express.json())
  app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:8080'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Id'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  }))
  app.use(defaultStorageMiddleware)
  app.use(requestLoggerMiddleware)
  app.use('/v1', bootstrapRest)

  setupSwagger(app, '/api-docs');

  const server = app.listen(envConfig.app.port, () => {})

  Logger.info(`${envConfig.app.name} Started at port ${envConfig.app.port}`)

  process.on('SIGTERM', () => {
    Logger.info('SIGTERM signal received: closing HTTP server')
    server.close(() => {
      Logger.info('HTTP server closed')
    })
  })
}

await main()