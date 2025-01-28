import { inject, injectable } from "inversify";
import express from "express";
import { INVERSIFY_TYPES } from "../../Inversify/InversifyTypes";
import { ILogger } from "../../utils/logging/Logger.interface";
import { expressErrorCallBack } from "../../Types/ExpressCallback";
import { error } from "console";
import { Exception } from "../../utils/exceptions/Exception";
import { ErrorCode } from "../../utils/exceptions/ErrorCode";
import { LocalizationMessage } from "../../utils/messages";
import { HttpStatus } from "../../utils/constants";

@injectable()
export class ErrorMiddleware {
  constructor(@inject(INVERSIFY_TYPES.Logger) private logger: ILogger) {}

  public handle(): expressErrorCallBack {
    return (
      error: Exception,
      request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ) => {
      const status = error.errorCode || ErrorCode.Undefined;

      this.logger.error(error.message);
      if (status === ErrorCode.Undefined && error.stack) {
        this.logger.error(error.stack);
      }

      const responseBody = [
        {
          message:
            error.message ||
            LocalizationMessage.errorMessage.SomethingWentWrong,
        },
      ];

      const httpStatus = this.getCode(status);
      response.status(httpStatus).json(responseBody);
      if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
        next(error);
      }
    };
  }

  private getCode(errorCode: ErrorCode): number {
    switch (errorCode) {
      case ErrorCode.Unauthorised:
        return HttpStatus.UNAUTHORIZED;
      case ErrorCode.Forbidden:
        return HttpStatus.FORBIDDEN;
      case ErrorCode.NotFound:
        return HttpStatus.NOT_FOUND;
      case ErrorCode.BadRequest:
        return HttpStatus.BAD_REQUEST;
      case ErrorCode.Conflict:
        return HttpStatus.CONFLICT;
      case ErrorCode.Undefined:
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
