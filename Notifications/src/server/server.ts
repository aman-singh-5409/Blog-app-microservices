import express from "express";
import { inject, injectable, multiInject } from "inversify";
import { INVERSIFY_TYPES } from "../Inversify/InversifyTypes";
import { ILogger } from "../utils/logging/Logger.interface";
import { ErrorMiddleware } from "./middlewares/ErrorMiddleware";
import { IRouterController } from "./controller/IRouterController";

@injectable()
export class Server {
  public readonly app: express.Application;

  constructor(
    @inject(INVERSIFY_TYPES.Logger) private logger: ILogger,
    @inject(INVERSIFY_TYPES.ErrorMiddleware)
    private errorMiddleware: ErrorMiddleware,
    @multiInject(INVERSIFY_TYPES.Controller)
    private controlllers: IRouterController[]
  ) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeControllers();
    this.initializeErrorHandler();
  }

  private initializeMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private initializeErrorHandler() {
    this.app.use(this.errorMiddleware.handle());
  }

  private initializeControllers() {
    this.controlllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      this.logger.info(`App listening on the port ${process.env.PORT}`);
    });
  }
}
