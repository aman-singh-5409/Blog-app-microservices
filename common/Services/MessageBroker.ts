import { injectable } from "inversify";
import { IMessageBroker } from "../Services/MessageBroker.interface";
import amqp from "amqplib/callback_api";

@injectable()
export class MessageBroker implements IMessageBroker {
  private messageBrokerConnection?: amqp.Connection;

  constructor() {
    this.initializeMessageBrokerConnection();
  }

  private initializeMessageBrokerConnection() {
    if (!this.messageBrokerConnection)
      amqp.connect(
        "amqp://localhost",
        (error: any, connection: amqp.Connection) => {
          if (error) {
            throw error;
          }
          this.messageBrokerConnection = connection;
        }
      );
  }

  public async publishToQueue(queue: string, msg: object): Promise<void> {}

  public async consumeFromQueue(
    queue: string,
    exec: (msg: object) => void
  ): Promise<void> {}
}
