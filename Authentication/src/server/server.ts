import express from "express";
import cookieParser from "cookie-parser";
import { inject, injectable, multiInject } from "inversify";
import { INVERSIFY_TYPES } from "../Inversify/InversifyTypes";
import { ILogger } from "../../../common/Logging/Logger.interface";
import { ErrorMiddleware } from "./middlewares/ErrorMiddleware";
import { IRouterController } from "./controllers/IRouterController";
import { COMMON_INVERSIFY_TYPES } from "../../../common/Inversify/InversifyTypes";

@injectable()
export class Server {
  public readonly app: express.Application;

  constructor(
    @inject(COMMON_INVERSIFY_TYPES.Logger) private logger: ILogger,
    @inject(INVERSIFY_TYPES.ErrorMiddleware)
    private errorMiddleware: ErrorMiddleware,
    @multiInject(INVERSIFY_TYPES.Controller)
    private controllers: IRouterController[]
  ) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeControllers();
    this.initializeErrorHandler();
  }

  private initializeMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
  }

  private initializeErrorHandler() {
    this.app.use(this.errorMiddleware.handler());
  }

  private initializeControllers() {
    this.controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      this.logger.info(`App listening on the port ${process.env.PORT}`);
    });
  }
}
