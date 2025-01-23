import express from "express";
import { inject, injectable } from "inversify";
import { INVERSIFY_TYPES } from "../Inversify/InversifyTypes";
import { ILogger } from "../utils/Logging/Logger.interface";

@injectable()
export class Server {
  public readonly app: express.Application;

  constructor(@inject(INVERSIFY_TYPES.Logger) private logger: ILogger) {
    this.app = express();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      this.logger.info(`App listening on the port ${process.env.PORT}`);
    });
  }
}
