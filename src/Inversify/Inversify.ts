import { Container } from "inversify";
import { ILogger } from "../utils/Logging/Logger.interface";
import { INVERSIFY_TYPES } from "./InversifyTypes";
import { WinstonLogger } from "../utils/Logging/WinstonLogger";
import { Server } from "../server/server";
import { IDatabaseConnection } from "../database/instances/DatabaseConnection.interface";
import { DatabaseConnection } from "../database/instances/DatabaseConnection";

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
