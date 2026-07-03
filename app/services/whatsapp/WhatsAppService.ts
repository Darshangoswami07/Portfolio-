import { IWhatsAppService } from '../interfaces';

function normalizeWhatsAppNumber(value: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith('whatsapp:') ? trimmed : `whatsapp:${trimmed}`;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export class WhatsAppService implements IWhatsAppService {
  private isConfigured(): boolean {
    return Boolean(
      process.env.TWILIO_ACCOUNT_SID?.trim() &&
        process.env.TWILIO_AUTH_TOKEN?.trim() &&
        process.env.TWILIO_WHATSAPP_FROM?.trim()
    );
  }

  async send(to: string, message: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('[WhatsAppService] Twilio WhatsApp is not configured. Skipping notification.', {
        hasSid: Boolean(process.env.TWILIO_ACCOUNT_SID),
        hasToken: Boolean(process.env.TWILIO_AUTH_TOKEN),
        hasFrom: Boolean(process.env.TWILIO_WHATSAPP_FROM),
      });
      return false;
    }

    if (!to.trim()) {
      console.warn('[WhatsAppService] ADMIN_WHATSAPP_NUMBER is missing. Skipping notification.');
      return false;
    }

    try {
      const twilio = (await import('twilio')).default;
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID!.trim(),
        process.env.TWILIO_AUTH_TOKEN!.trim()
      );

      const result = await client.messages.create({
        from: normalizeWhatsAppNumber(process.env.TWILIO_WHATSAPP_FROM!.trim()),
        to: normalizeWhatsAppNumber(to),
        body: message,
      });

      console.info(`[WhatsAppService] WhatsApp notification sent. SID: ${result.sid}`);
      return true;
    } catch (error) {
      console.error(`[WhatsAppService] Failed to send WhatsApp notification: ${getErrorMessage(error)}`);
      return false;
    }
  }
}

export const whatsAppService = new WhatsAppService();
