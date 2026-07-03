import { INotificationService, INotificationPayload } from '../interfaces';
import { emailService } from '../email/EmailService';
import { smsService } from '../sms/SmsService';
import { whatsAppService } from '../whatsapp/WhatsAppService';

type NotificationChannel = 'email' | 'sms' | 'whatsapp';

export class NotificationService implements INotificationService {
  async sendEmail(payload: INotificationPayload): Promise<boolean> {
    return emailService.send(payload.to, payload.subject || 'Notification', payload.message);
  }

  async sendSms(payload: INotificationPayload): Promise<boolean> {
    return smsService.send(payload.to, payload.message);
  }

  async sendWhatsApp(payload: INotificationPayload): Promise<boolean> {
    return whatsAppService.send(payload.to, payload.message);
  }

  async notifyAll(
    payload: INotificationPayload,
    channels: NotificationChannel[]
  ): Promise<Record<NotificationChannel, boolean | undefined>> {
    const results: Record<NotificationChannel, boolean | undefined> = {
      email: undefined,
      sms: undefined,
      whatsapp: undefined,
    };

    await Promise.all(
      channels.map(async (channel) => {
        if (channel === 'email') {
          results.email = await this.sendEmail(payload);
        }

        if (channel === 'sms') {
          results.sms = await this.sendSms(payload);
        }

        if (channel === 'whatsapp') {
          results.whatsapp = await this.sendWhatsApp(payload);
        }
      })
    );

    return results;
  }
}

export const notificationService = new NotificationService();
