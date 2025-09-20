import type { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger.util';

/**
 * Middleware to log request details after the response is sent
 */
export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  // Store the start time
  const startTime = process.hrtime();

  // Function to execute when response finishes
  res.on('finish', () => {
    const durationInMs = getDurationInMs(startTime);
    const { method, originalUrl, ip } = req;
    const statusCode = res.statusCode;
    const contentLength = res.get('content-length') || 0;

    // Log the request details
    Logger.info(
      `${method} ${originalUrl} ${statusCode} ${contentLength}b - ${durationInMs}ms - ${ip}`
    );
  });

  next();
}

/**
 * Calculate duration in milliseconds from process.hrtime()
 */
function getDurationInMs(start: [number, number]): number {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}
