import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { appointmentSchema } from '../../validators/appointment';
import { notificationService } from '../../services/notifications/NotificationService';
import { assertDatabaseReady, isPrismaEnabled, prisma } from '../../../lib/prisma';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validatedData = appointmentSchema.parse(body);

    if (!isPrismaEnabled()) {
      return NextResponse.json(
        {
          message: 'Database is not configured. Appointment was not saved.',
        },
        { status: 503 }
      );
    }

    await assertDatabaseReady();

    const appointment = await prisma.appointment.create({
      data: {
        name: validatedData.fullName,
        email: validatedData.email,
        phone: null,
        company: validatedData.companyName || null,
        purpose: validatedData.meetingType,
        message: validatedData.message,
        preferredDate: validatedData.date,
        preferredTime: validatedData.time,
        timezone: validatedData.timezone,
        status: 'PENDING',
        meetingProvider: 'MANUAL',
      },
    });

    const safeName = escapeHtml(validatedData.fullName);
    const safeEmail = escapeHtml(validatedData.email);
    const safeCompany = escapeHtml(validatedData.companyName || 'N/A');
    const safeMeetingType = escapeHtml(validatedData.meetingType);
    const safeDate = escapeHtml(validatedData.date);
    const safeTime = escapeHtml(validatedData.time);
    const safeTimezone = escapeHtml(validatedData.timezone);
    const safeMessage = escapeHtml(validatedData.message);

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: #f97316; padding: 30px 24px;">
          <h2 style="color: white; margin: 0; font-size: 24px;">New Meeting Request</h2>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0;">From your portfolio booking system</p>
        </div>
        <div style="padding: 28px 24px; background: #fff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${safeName}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Email</td><td style="padding: 8px 0; color: #111827;">${safeEmail}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Company</td><td style="padding: 8px 0; color: #111827;">${safeCompany}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Meeting Type</td><td style="padding: 8px 0; color: #111827;">${safeMeetingType}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Date</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${safeDate}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Time</td><td style="padding: 8px 0; font-weight: 600; color: #111827;">${safeTime}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Timezone</td><td style="padding: 8px 0; color: #111827;">${safeTimezone}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #f97316;">
            <p style="margin: 0 0 6px; font-weight: 600; color: #374151;">Message:</p>
            <p style="margin: 0; color: #4b5563; line-height: 1.6;">${safeMessage}</p>
          </div>
          <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">Appointment ID: ${appointment.id}</p>
        </div>
      </div>
    `;

    const emailSent = await notificationService.sendEmail({
      to: process.env.EMAIL_USER?.trim() || 'darshangirigoswami07@gmail.com',
      subject: `Meeting Request: ${validatedData.meetingType} - ${validatedData.fullName}`,
      message: htmlMessage,
    });

    const whatsappMessage =
      `New Meeting Request\n\n` +
      `Name: ${validatedData.fullName}\n` +
      `Email: ${validatedData.email}\n` +
      `Company: ${validatedData.companyName || 'N/A'}\n` +
      `Type: ${validatedData.meetingType}\n` +
      `Date: ${validatedData.date}\n` +
      `Time: ${validatedData.time} (${validatedData.timezone})\n\n` +
      `Message: ${validatedData.message}`;

    const whatsappSent = await notificationService.sendWhatsApp({
      to: process.env.ADMIN_WHATSAPP_NUMBER?.trim() || '',
      message: whatsappMessage,
    });

    return NextResponse.json(
      {
        message: 'Appointment saved successfully.',
        appointmentId: appointment.id,
        notifications: {
          emailSent,
          whatsappSent,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Appointments API] Booking failed:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: 'Validation error',
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: 'Appointment booking failed.',
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
