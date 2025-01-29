import express from "express";
import { IRouterController } from "./IRouterController";
import { inject, injectable } from "inversify";
import { Exception } from "../../../../common/exceptions/Exception";
import { ErrorCode } from "../../../../common/exceptions/ErrorCode";
import { LocalizationMessage } from "../../../../common/helpers/messages";
import { INVERSIFY_TYPES } from "../../Inversify/InversifyTypes";
import { IUserDatastore } from "../../datastore/UserDatastore.interface";
import { User } from "../../database/entities/User";
import { IAuthRepository } from "../../repository/AuthRepository.interface";

@injectable()
export class AuthController implements IRouterController {
  public readonly router: express.Router;

  private path = "/auth";

  constructor(
    @inject(INVERSIFY_TYPES.AuthRepository)
    private authRepository: IAuthRepository
  ) {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.loginUser);
    this.router.post(`${this.path}/create-account`, this.createUserAccount);
  }

  private loginUser = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        throw new Exception(
          ErrorCode.BadRequest,
          LocalizationMessage.errorMessage.MissingRequiredFields
        );
      }

      const res = await this.authRepository.loginWithEmailAndPassword({
        email,
        password,
      });

      response.cookie("auth_token", res.authToken);

      const { password: pass, ...resultWithoutPassword } = res.user;

      response.status(200).json(resultWithoutPassword);
    } catch (error) {
      next(error);
    }
  };

  private createUserAccount = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { username, email, password } = request.body;

      if (!username || !email || !password) {
        throw new Exception(
          ErrorCode.BadRequest,
          LocalizationMessage.errorMessage.MissingRequiredFields
        );
      }

      const res = await this.authRepository.createAccountWithEmailAndPassword({
        email,
        password,
        username,
      });

      const { password: pass, ...resultWithoutPassword } = res;

      response.status(200).json(resultWithoutPassword);
    } catch (error) {
      next(error);
    }
  };
}
