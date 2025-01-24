import express from "express";
import { IRouterController } from "./IRouterController";
import { injectable } from "inversify";

@injectable()
export class AuthController implements IRouterController {
  public readonly router: express.Router;

  private path = "/auth";

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.loginUser);
    this.router.post(`${this.path}/create-account`, this.createUserAccount);
  }

  private loginUser = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {};

  private createUserAccount = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {};
}
