export interface ILogger {
  debug(message: string, metaData?: object): void;

  info(message: string, metaData?: object): void;

  warn(message: string, metaData?: object): void;

  error(message: string, metaData?: object): void;
}
