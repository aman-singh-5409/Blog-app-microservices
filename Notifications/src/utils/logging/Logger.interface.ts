export interface ILogger {
  info(message: string, metaData?: object): void;

  warn(message: string, metaData?: object): void;

  error(message: string, metaData?: object): void;

  debug(message: string, metaData?: object): void;
}
