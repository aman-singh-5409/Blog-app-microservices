import { injectable } from "inversify";
import { ILogger } from "./Logger.interface";
import * as winston from "winston";

@injectable()
export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: "debug",
          handleExceptions: true,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint({ colorize: true })
          ),
        }),
      ],
      exitOnError: false,
    });
  }

  public debug(message: string, metaData?: object): void {
    this.logger.debug(message, metaData);
  }

  public error(message: string, metaData?: object): void {
    this.logger.error(message, metaData);
  }

  public info(message: string, metaData?: object): void {
    this.logger.info(message, metaData);
  }

  public warn(message: string, metaData?: object): void {
    this.logger.info(message, metaData);
  }
}
