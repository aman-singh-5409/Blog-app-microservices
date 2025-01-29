import { Container } from "inversify";
import { COMMON_INVERSIFY_TYPES } from "../Inversify/InversifyTypes";

// Logger
import { ILogger } from "../Logging/Logger.interface";
import { WinstonLogger } from "../Logging/WinstonLogger";

// Services
import { IMessageBroker } from "../Services/MessageBroker.interface";
import { MessageBroker } from "../Services/MessageBroker";

export const initializeLogger = (container: Container) => {
  container
    .bind<ILogger>(COMMON_INVERSIFY_TYPES.Logger)
    .to(WinstonLogger)
    .inSingletonScope();
  return container;
};

export const initializeService = (container: Container) => {
  container
    .bind<IMessageBroker>(COMMON_INVERSIFY_TYPES.MessageBroker)
    .to(MessageBroker);
  return container;
};
