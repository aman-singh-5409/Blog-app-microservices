import { NextFunction, Router } from "express";
import express from "express";
import { IRouterController } from "./IRouterController";
import { inject, injectable } from "inversify";
import { Exception } from "../../utils/exceptions/Exception";
import { ErrorCode } from "../../utils/exceptions/ErrorCode";
import { LocalizationMessage } from "../../utils/messages";
import { INVERSIFY_TYPES } from "../../Inversify/InversifyTypes";
import { IMailRepository } from "../../repository/MailRespository.interface";

@injectable()
export class MailController implements IRouterController {
  public readonly router: Router;

  private path = "/mail";

  constructor(
    @inject(INVERSIFY_TYPES.MailRespository)
    private mailRepository: IMailRepository
  ) {
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(`${this.path}/send`, this.sendEmail);
  }

  private sendEmail = async (
    request: express.Request,
    response: express.Response,
    next: NextFunction
  ) => {
    try {
      const { to, content, subject } = request.body;

      if (!to || !content || !subject) {
        throw new Exception(
          ErrorCode.BadRequest,
          LocalizationMessage.errorMessage.MissingRequiredFields
        );
      }

      const res = await this.mailRepository.sendMail(to, content, subject);

      response.status(200).json({ message: "Email Sent Successfully" });
    } catch (error) {
      next(error);
    }
  };
}
