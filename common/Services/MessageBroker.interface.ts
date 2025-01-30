import amqp from 'amqplib/callback_api';

export interface IMessageBroker {
  messageBrokerConnection?: amqp.Connection;
  publishToQueue(queue: string, msg: object): Promise<void>;
  consumeFromQueue(queue: string, exec: (msg: object) => void): Promise<void>;
}
