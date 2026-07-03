import nodemailer from 'nodemailer';
import { IEmailService } from '../interfaces';

const MAX_SEND_ATTEMPTS = 3;
const RETRY_DELAY_MS = 750;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isGmailAuthError(message: string): boolean {
  return (
    message.includes('Invalid login') ||
    message.includes('Username and Password not accepted') ||
    message.includes('535')
  );
}

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter | null = null;
  private verifiedForUser: string | null = null;

  private async getTransporter(): Promise<nodemailer.Transporter | null> {
    const user = process.env.EMAIL_USER?.trim();
    const pass = process.env.EMAIL_PASS?.trim();

    if (!user || !pass) {
      console.warn('[EmailService] EMAIL_USER or EMAIL_PASS is missing. Email will not be sent.');
      return null;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user)) {
      console.error(`[EmailService] EMAIL_USER "${user}" is not a valid email address.`);
      return null;
    }

    if (this.transporter && this.verifiedForUser === user) {
      return this.transporter;
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
        pool: true,
        maxConnections: 2,
        maxMessages: 100,
      });

      await transporter.verify();

      this.transporter = transporter;
      this.verifiedForUser = user;
      console.info('[EmailService] SMTP connection verified.');

      return transporter;
    } catch (error) {
      const message = getErrorMessage(error);
      this.transporter = null;
      this.verifiedForUser = null;

      console.error(`[EmailService] SMTP verification failed: ${message}`);
      if (isGmailAuthError(message)) {
        console.error(
          '[EmailService] Gmail rejected the credentials. Use a Gmail App Password with 2-Step Verification enabled.'
        );
      }

      return null;
    }
  }

  async send(to: string, subject: string, html: string): Promise<boolean> {
    const user = process.env.EMAIL_USER?.trim();
    const transporter = await this.getTransporter();

    if (!transporter || !user) {
      return false;
    }

    for (let attempt = 1; attempt <= MAX_SEND_ATTEMPTS; attempt += 1) {
      try {
        const info = await transporter.sendMail({
          from: `"Darshan Giri Goswami Portfolio" <${user}>`,
          to,
          subject,
          html,
        });

        console.info(`[EmailService] Email sent to ${to}. Message ID: ${info.messageId}`);
        return true;
      } catch (error) {
        const message = getErrorMessage(error);
        console.error(
          `[EmailService] Email send attempt ${attempt}/${MAX_SEND_ATTEMPTS} failed: ${message}`
        );

        if (isGmailAuthError(message)) {
          this.transporter = null;
          this.verifiedForUser = null;
          console.error(
            '[EmailService] Gmail authentication failed. Confirm EMAIL_USER and EMAIL_PASS use a valid App Password.'
          );
          return false;
        }

        if (attempt < MAX_SEND_ATTEMPTS) {
          await sleep(RETRY_DELAY_MS * attempt);
        }
      }
    }

    return false;
  }
}

export const emailService = new EmailService();
