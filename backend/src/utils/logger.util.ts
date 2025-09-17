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

  private prependAsyncLocalStorage(...msgs: (string|number)[]): (string|number)[] {
    if (!getAllAsyncLocalStorage()) return msgs

    return [JSON.stringify(getAllAsyncLocalStorage()), ...msgs];
  }

  static init(filename: string) {
    Logger.instance = new Logger(filename)
  }
  static debug(...msgs: (string|number)[]) {
    Logger.instance.log.debug(Logger.instance.prependAsyncLocalStorage(...msgs).join(';'))
  }
  static info(...msgs: (string|number)[]) {
    Logger.instance.log.info(Logger.instance.prependAsyncLocalStorage(...msgs).join(';'))
  }
  static warn(...msgs: (string|number)[]) {
    Logger.instance.log.warn(Logger.instance.prependAsyncLocalStorage(...msgs).join(';'))
  }
  static error(...msgs: (string|number|Error)[]) {
    const newMsgs: (string|number)[] = []

    for (const msg of msgs) {
      if (!['string','number'].includes(typeof msg)) {
        newMsgs.push((msg as Error).message)
      } else {
        newMsgs.push(msg as (string|number));
      }
    }
    Logger.instance.log.error(Logger.instance.prependAsyncLocalStorage(...newMsgs).join(';'))
  }
}