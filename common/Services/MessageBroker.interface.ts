export interface IMessageBroker {
  publishToQueue(queue: string, msg: object): Promise<void>;
  consumeFromQueue(queue: string, exec: (msg: object) => void): Promise<void>;
}
