import { Container } from "inversify";
import { Server } from "./server/server";
import {
  initializeControllers,
  initializeMiddlewares,
  initializeRepository,
  initializeServer,
  initializeServices,
} from "./Inversify/Inversify";
import {
  initializeLogger,
  initializeService as initializeCommonServices,
} from "../../common/Inversify/Inversify";
import { INVERSIFY_TYPES } from "./Inversify/InversifyTypes";
import { IMessageBroker } from "../../common/Services/MessageBroker.interface";
import { COMMON_INVERSIFY_TYPES } from "../../common/Inversify/InversifyTypes";

export class ServerInit {
  public readonly appServer: Server;

  public inversifyContainer: Container;

  constructor() {
    this.inversifyContainer = this.initInversifyContainer();

    /** Get instance of express server from inversify */
    this.appServer = this.inversifyContainer.get<Server>(
      INVERSIFY_TYPES.Server
    );
  }

  initInversifyContainer() {
    const container = new Container();
    initializeLogger(container);
    initializeCommonServices(container);
    initializeServer(container);
    initializeServices(container);
    initializeMiddlewares(container);
    initializeControllers(container);
    initializeRepository(container);
    return container;
  }
}
