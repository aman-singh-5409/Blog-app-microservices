export interface ISendEmail {
  to: string;
  subject: string;
  content: string;
  html?: string;
}

export interface IEmailService {
  sendEmail(args: ISendEmail): Promise<void>;
}
