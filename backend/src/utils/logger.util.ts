import winston from 'winston'
import dayjs from 'dayjs'
import { getAllAsyncLocalStorage } from "./local-storage.util";


export class Logger {
  private static instance: Logger
  private readonly log: winston.Logger

  constructor(filename: string) {
    const {combine, timestamp, uncolorize, colorize, printf} = winston.format
    const consoleFormat = printf((info) => `[${dayjs().toISOString()}] ${info.level}: ${info.message as string}`)

    this.log = winston.createLogger({
      format: colorize({colors: {
          debug: 'grey',
          info: 'blue',
          error: 'red',
          warn: 'yellow',
        }}),
      transports: [
        new winston.transports.Console({format: combine(consoleFormat, )}),
        new winston.transports.File({
          filename,
          level: 'warn',
          format: combine(timestamp(), uncolorize(), winston.format.json())
        }),
      ],
    })
  }

  private jsonizeObject(...msgs: any) {
    const newMsgs: any = []
    for (const msg of msgs) {
      if (typeof msg === 'object') {
        newMsgs.push(JSON.stringify(msg))
      } else {
        newMsgs.push(msg)
      }
    }
    return newMsgs
  }

  static init(filename: string) {
    Logger.instance = new Logger(filename)
  }
  static debug(...msgs: any) {
    Logger.instance.log.debug(this.instance.jsonizeObject(msgs))
  }
  static info(...msgs: any) {
    Logger.instance.log.info(this.instance.jsonizeObject(msgs))
  }
  static warn(...msgs: any) {
    Logger.instance.log.warn(this.instance.jsonizeObject(msgs))
  }
  static error(...msgs: any) {

    Logger.instance.log.error(this.instance.jsonizeObject(msgs))
  }
}