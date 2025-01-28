import { inject, injectable } from "inversify";
import { IMailRepository } from "./MailRespository.interface";
import { INVERSIFY_TYPES } from "../Inversify/InversifyTypes";
import { IEmailService } from "../services/EmailService.interface";

@injectable()
export class MailRespository implements IMailRepository {
  constructor(
    @inject(INVERSIFY_TYPES.EmailService) private emailService: IEmailService
  ) {}

  public async sendMail(
    to: string,
    content: string,
    subject: string
  ): Promise<void> {
    return this.emailService.sendEmail({
      to,
      content,
      subject,
    });
  }
}
