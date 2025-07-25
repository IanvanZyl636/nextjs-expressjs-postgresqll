import { createLogger, format, transports, Logger } from 'winston';
import {prisma} from '../prisma';
const isProduction = process.env.NODE_ENV === 'production';

const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), logFormat),
  transports: isProduction
    ? [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/app.log', level: 'info' }),
      ]
    : [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
      ],
});

logger.on('data', async (log) => {
  try {
    await prisma.log.create({
      data: {
        level: log.level,
        message: log.message,
        requestData: log.requestData,
        timestamp: new Date(log.timestamp || Date.now()),
      },
    });
  } catch (err) {
    console.error('DB log insert failed:', err);
  }
});

export default logger;
