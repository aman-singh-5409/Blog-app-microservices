import { Container } from "inversify";
import { ILogger } from "../utils/Logging/Logger.interface";
import { INVERSIFY_TYPES } from "./InversifyTypes";
import { WinstonLogger } from "../utils/Logging/WinstonLogger";
import { Server } from "../server/server";
import { IDatabaseConnection } from "../database/instances/DatabaseConnection.interface";
import { DatabaseConnection } from "../database/instances/DatabaseConnection";
import { IRouterController } from "../server/controllers/IRouterController";
import { AuthController } from "../server/controllers/AuthController";
import { IAuthRepository } from "../repository/AuthRepository.interface";
import { AuthRepository } from "../repository/AuthRepository";
import { IUserDatastore } from "../datastore/UserDatastore.interface";
import { UserDatastore } from "../datastore/UserDatastore";

// Datastores
export const initializeDatastores = (container: Container) => {
  container
    .bind<IUserDatastore>(INVERSIFY_TYPES.UserDatastore)
    .to(UserDatastore);
  return container;
};

// Repositories
export const initializeRepositories = (container: Container) => {
  container
    .bind<IAuthRepository>(INVERSIFY_TYPES.AuthRepository)
    .to(AuthRepository);
  return container;
};

// Controllers
export const initializeControllers = (container: Container) => {
  container
    .bind<IRouterController>(INVERSIFY_TYPES.Controller)
    .to(AuthController);
  return container;
};

// Logger
export const initializeLogger = (container: Container) => {
  container
    .bind<ILogger>(INVERSIFY_TYPES.Logger)
    .to(WinstonLogger)
    .inSingletonScope();
  return container;
};

// Database
export const initializeDatabase = (container: Container) => {
  container
    .bind<IDatabaseConnection>(INVERSIFY_TYPES.DatabaseConnection)
    .to(DatabaseConnection)
    .inSingletonScope();
  return container;
};

// Server
export const initializeServer = (container: Container) => {
  container.bind<Server>(INVERSIFY_TYPES.Server).to(Server).inSingletonScope();
  return container;
};
