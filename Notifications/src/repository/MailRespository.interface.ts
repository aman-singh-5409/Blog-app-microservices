export interface IMailRepository {
  sendMail(to: string, content: string, subject: string): Promise<void>;
}
