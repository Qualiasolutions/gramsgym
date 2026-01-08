// WhatsApp Business API Integration
// Uses Meta's Cloud API for WhatsApp Business

import { fetchWithTimeout, TimeoutError } from '@/lib/fetch-with-timeout'

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0'
const WHATSAPP_TIMEOUT_MS = 10000 // 10 seconds

interface WhatsAppMessageResponse {
  success: boolean
  messageId?: string
  error?: string
}

// Send a WhatsApp text message
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<WhatsAppMessageResponse> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN

  if (!phoneNumberId || !accessToken) {
    console.log('WhatsApp not sent - credentials not configured')
    console.log('Would send WhatsApp:', { to, message })
    return { success: false, error: 'WhatsApp service not configured' }
  }

  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhone = to.replace(/[^0-9]/g, '')

  try {
    const response = await fetchWithTimeout(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        }),
      },
      WHATSAPP_TIMEOUT_MS
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('WhatsApp API error:', data)
      return { success: false, error: data.error?.message || 'Failed to send message' }
    }

    console.log('WhatsApp message sent:', data)
    return { success: true, messageId: data.messages?.[0]?.id }
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.error('WhatsApp API timeout:', error.message)
      return { success: false, error: 'WhatsApp service timeout' }
    }
    console.error('WhatsApp send error:', error)
    return { success: false, error: 'Failed to send WhatsApp message' }
  }
}

// WhatsApp message templates
export const whatsappTemplates = {
  // Welcome message for new members
  welcomeMember: (name: string) => `
مرحباً ${name}! 👋

أهلاً بك في عائلة جرامز جيم! 💪

Welcome to the Grams Gym family!

Your member account has been created. You can now:
✅ Book PT sessions
✅ Track your progress
✅ Chat with our AI fitness coach

Login at: ${process.env.NEXT_PUBLIC_APP_URL}/member/login

Let's start your transformation journey! 🏋️‍♂️
  `.trim(),

  // Booking confirmation
  bookingConfirmation: (name: string, coachName: string, date: string, time: string) => `
✅ *Session Confirmed!*

Hi ${name},

Your PT session is booked:
📅 Date: ${date}
⏰ Time: ${time}
👤 Coach: ${coachName}
⏱️ Duration: 60 min

Tips:
• Arrive 10 min early
• Bring water & towel
• Eat light 1-2 hrs before

See you at Grams Gym! 💪
  `.trim(),

  // Booking cancellation
  bookingCancellation: (name: string, date: string, time: string) => `
❌ *Session Cancelled*

Hi ${name},

Your session on ${date} at ${time} has been cancelled.

Your session credit has been restored.

Ready to rebook?
${process.env.NEXT_PUBLIC_APP_URL}/member/book

- Grams Gym Team
  `.trim(),

  // Session reminder (24 hours before)
  sessionReminder: (name: string, coachName: string, date: string, time: string) => `
⏰ *Session Reminder!*

Hi ${name},

Don't forget your PT session tomorrow:
📅 ${date}
⏰ ${time}
👤 Coach: ${coachName}

Prepare:
✓ Good sleep tonight
✓ Stay hydrated
✓ Pack your gym bag

Can't make it? Cancel at least 24hrs before.

See you tomorrow! 💪
- Grams Gym
  `.trim(),

  // Subscription expiring soon
  subscriptionExpiring: (name: string, subscriptionType: string, daysLeft: number) => `
⚠️ *Subscription Expiring Soon*

Hi ${name},

Your ${subscriptionType} expires in *${daysLeft} days*!

Don't break your momentum - renew now:
${process.env.NEXT_PUBLIC_APP_URL}/pricing

Questions? Reply to this message or visit us at the gym!

- Grams Gym Team 💪
  `.trim(),

  // PT sessions running low
  ptSessionsLow: (name: string, remainingSessions: number) => `
📊 *PT Sessions Update*

Hi ${name},

You have *${remainingSessions} PT sessions* remaining.

Keep the gains coming! Check out our packages:
${process.env.NEXT_PUBLIC_APP_URL}/pricing

Talk to your coach about the best package for your goals!

- Grams Gym Team 💪
  `.trim(),

  // Coach notification: New booking
  coachNewBooking: (coachName: string, memberName: string, date: string, time: string) => `
📅 *New Session Booked*

Hi ${coachName},

New PT session:
👤 Member: ${memberName}
📅 Date: ${date}
⏰ Time: ${time}

View schedule: ${process.env.NEXT_PUBLIC_APP_URL}/coach/bookings

- Grams Gym System
  `.trim(),

  // Coach notification: Session cancelled
  coachBookingCancelled: (coachName: string, memberName: string, date: string, time: string) => `
❌ *Session Cancelled*

Hi ${coachName},

${memberName} cancelled their session:
📅 Date: ${date}
⏰ Time: ${time}

This slot is now available.

- Grams Gym System
  `.trim(),
}
