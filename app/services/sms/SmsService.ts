import { ISmsService } from '../interfaces';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export class SmsService implements ISmsService {
  private isConfigured(): boolean {
    return Boolean(
      process.env.TWILIO_ACCOUNT_SID?.trim() &&
        process.env.TWILIO_AUTH_TOKEN?.trim() &&
        process.env.TWILIO_FROM?.trim()
    );
  }

  async send(to: string, message: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('[SmsService] Twilio SMS is not configured. Skipping notification.', {
        hasSid: Boolean(process.env.TWILIO_ACCOUNT_SID),
        hasToken: Boolean(process.env.TWILIO_AUTH_TOKEN),
        hasFrom: Boolean(process.env.TWILIO_FROM),
      });
      return false;
    }

    if (!to.trim()) {
      console.warn('[SmsService] Destination phone number is missing. Skipping notification.');
      return false;
    }

    try {
      const twilio = (await import('twilio')).default;
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID!.trim(),
        process.env.TWILIO_AUTH_TOKEN!.trim()
      );

      const result = await client.messages.create({
        from: process.env.TWILIO_FROM!.trim(),
        to: to.trim(),
        body: message,
      });

      console.info(`[SmsService] SMS sent. SID: ${result.sid}`);
      return true;
    } catch (error) {
      console.error(`[SmsService] Failed to send SMS: ${getErrorMessage(error)}`);
      return false;
    }
  }
}

export const smsService = new SmsService();
