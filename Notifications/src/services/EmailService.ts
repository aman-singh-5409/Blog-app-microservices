import { IEmailService, ISendEmail } from "./EmailService.interface";
import nodemailer from "nodemailer";

export class EmailService implements IEmailService {
  private emailTransporter: nodemailer.Transporter;

  constructor() {
    this.emailTransporter = this.initializeEmailTransporter();
  }

  private initializeEmailTransporter(): nodemailer.Transporter {
    console.log({auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    }})
    return nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  public async sendEmail({
    to,
    content,
    subject,
    html,
  }: ISendEmail): Promise<void> {
    return this.emailTransporter.sendMail({
      from: process.env.MAIL_USER,
      to: to,
      subject,
      html,
      text: content,
    });
  }
}
