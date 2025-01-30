import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import { injectable, inject } from "inversify";
import { IMessageBroker } from "../Services/MessageBroker.interface";
import amqp from "amqplib";
import { COMMON_INVERSIFY_TYPES } from "../../common/Inversify/InversifyTypes";
import { ILogger } from "../../common/Logging/Logger.interface";

@injectable()
export class MessageBroker implements IMessageBroker {
  public messageBrokerConnection?: amqp.Connection;

  constructor(@inject(COMMON_INVERSIFY_TYPES.Logger) private logger: ILogger) {
    this.initializeMessageBrokerConnection();
  }

  private async initializeMessageBrokerConnection() {
    if (!this.messageBrokerConnection) {
      this.messageBrokerConnection = await amqp.connect({
        username: process.env.MESSAGE_BROKER_USER,
        password: process.env.MESSAGE_BROKER_PASS,
      });
    }
  }

  public async publishToQueue(queue: string, msg: object): Promise<void> {
    if (!this.messageBrokerConnection) return;

    const channel = await this.messageBrokerConnection.createChannel();
    await channel.assertQueue(queue, { durable: false });

    const stringifiedMsg = JSON.stringify(msg);
    console.log("worked");
    channel.sendToQueue(queue, Buffer.from(stringifiedMsg));
  }

  private async waitForMessageBrokerConnection(
    delay: number,
    maxTries: number = 5
  ) {
    let tries = 1;
    while (!this.messageBrokerConnection && tries < maxTries) {
      this.logger.info(
        `Waiting for message broker connection. Attempt ${tries} of ${maxTries} attempts`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      tries++;
    }
  }

  public async consumeFromQueue(
    queue: string,
    exec: (msg: object) => void
  ): Promise<void> {
    await this.waitForMessageBrokerConnection(5000);

    if (!this.messageBrokerConnection) return;

    const channel = await this.messageBrokerConnection.createChannel();

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.consume(
      queue,
      (msg: amqp.Message | null) => {
        if (msg) {
          exec(msg);
          channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  }
}
