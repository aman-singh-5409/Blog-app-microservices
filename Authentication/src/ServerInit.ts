import { Container } from "inversify";
import { Server } from "./server/server";
import {
  initializeControllers,
  initializeDatabase,
  initializeDatastores,
  initializeMiddlewares,
  initializeRepositories,
  initializeServer,
} from "./Inversify/Inversify";
import { initializeLogger, initializeService } from '../../common/Inversify/Inversify';
import { INVERSIFY_TYPES } from "./Inversify/InversifyTypes";
import { IDatabaseConnection } from "./database/instances/DatabaseConnection.interface";

export class ServerInit {
  public readonly appServer: Server;

  private inversifyContainer: Container;

  constructor() {
    this.inversifyContainer = this.initInversifyContainer();

    /** Get the instance of express server from inversify */
    this.appServer = this.inversifyContainer.get<Server>(
      INVERSIFY_TYPES.Server
    );

    /** Get the instance of DatabaseConnection to initialize the connect with DB */
    this.inversifyContainer.get<IDatabaseConnection>(
      INVERSIFY_TYPES.DatabaseConnection
    );
  }

  initInversifyContainer() {
    const container = new Container();
    initializeLogger(container);
    initializeServer(container);
    initializeMiddlewares(container);
    initializeDatabase(container);
    initializeDatastores(container);
    initializeRepositories(container);
    initializeControllers(container);
    initializeService(container);
    return container;
  }
}
