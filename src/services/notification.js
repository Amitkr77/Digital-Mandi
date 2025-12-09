// services/notification.js
import twilioClient from '@/lib/twilioClient';

/**
 * Send notification to farmer (SMS + WhatsApp)
 * @param {string} phone - Indian number with +91 e.g., +919876543210
 * @param {string} message - The message to send
 * @param {string} channel - 'sms' | 'whatsapp' | 'both' (default: both)
 */
export async function sendNotification(phone, message, channel = 'both') {
  if (!phone || !message) {
    console.error('Phone or message missing');
    return false;
  }

  // Clean phone number
  let toNumber = phone.trim();
  if (!toNumber.startsWith('+')) {
    toNumber = '+91' + toNumber.replace(/\D/g, '').slice(-10);
  }

  const fromSMS = process.env.TWILIO_PHONE_NUMBER;
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || '7903500042';

  const results = { sms: false, whatsapp: false };

  try {
    // Send SMS
    if (channel === 'sms' || channel === 'both') {
      if (fromSMS) {
        await twilioClient.messages.create({
          body: `Digital Mandi: ${message}`,
          from: fromSMS,
          to: toNumber,
        });
        results.sms = true;
        console.log(`SMS sent to ${toNumber}`);
      }
    }

    // Send WhatsApp
    if (channel === 'whatsapp' || channel === 'both') {
      if (fromWhatsApp) {
        await twilioClient.messages.create({
          body: `Digital Mandi: ${message}`,
          from: fromWhatsApp,
          to: `whatsapp:${toNumber}`,
        });
        results.whatsapp = true;
        console.log(`WhatsApp sent to ${toNumber}`);
      }
    }

    return results;
  } catch (error) {
    console.error('Notification failed:', error.message);
    return results;
  }
}