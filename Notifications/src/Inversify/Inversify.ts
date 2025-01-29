import { Container } from "inversify";
import { IEmailService } from "../services/EmailService.interface";
import { INVERSIFY_TYPES } from "./InversifyTypes";
import { EmailService } from "../services/EmailService";
import { Server } from "../server/server";
import { ErrorMiddleware } from "../server/middlewares/ErrorMiddleware";
import { IRouterController } from "../server/controller/IRouterController";
import { MailController } from "../server/controller/MailController";
import { IMailRepository } from "../repository/MailRespository.interface";
import { MailRespository } from "../repository/MailRepository";

// Services
export const initializeServices = (container: Container) => {
  container.bind<IEmailService>(INVERSIFY_TYPES.EmailService).to(EmailService);
  return container;
};

// Repositories
export const initializeRepository = (container: Container) => {
  container
    .bind<IMailRepository>(INVERSIFY_TYPES.MailRespository)
    .to(MailRespository);
  return container;
};

// Controllers
export const initializeControllers = (container: Container) => {
  container
    .bind<IRouterController>(INVERSIFY_TYPES.Controller)
    .to(MailController);
  return container;
};

// Middlewares
export const initializeMiddlewares = (container: Container) => {
  container.bind(INVERSIFY_TYPES.ErrorMiddleware).to(ErrorMiddleware);
  return container;
};

// Server
export const initializeServer = (container: Container) => {
  container.bind<Server>(INVERSIFY_TYPES.Server).to(Server).inSingletonScope();
  return container;
};
