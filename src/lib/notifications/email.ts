import { Resend } from 'resend'
import { withTimeout, TimeoutError } from '@/lib/fetch-with-timeout'

// Initialize Resend only if API key is available
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

const FROM_EMAIL = 'Grams Gym <noreply@gramsgym.com>'
const EMAIL_TIMEOUT_MS = 10000 // 10 seconds

// Email templates
export const emailTemplates = {
  // Welcome email for new members
  welcomeMember: (name: string, email: string) => ({
    to: email,
    subject: 'Welcome to Grams Gym! 💪',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to Grams Gym!</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Welcome to the Grams Gym family! We're thrilled to have you join us on your fitness journey.</p>
            <p>Here's what you can do now:</p>
            <ul>
              <li>📱 Log in to your member portal to view your subscriptions</li>
              <li>📅 Book personal training sessions with our expert coaches</li>
              <li>💬 Chat with our AI fitness coach for workout and nutrition tips</li>
            </ul>
            <p>Remember: <em>"Every gram of effort counts towards your transformation!"</em></p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/member/login" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Portal</a>
            </div>
            <p>If you have any questions, feel free to reach out to us on WhatsApp or visit us at the gym!</p>
            <p>Let's crush those goals together! 💪</p>
            <p>- The Grams Gym Team</p>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Grams Gym | Amman, Jordan</p>
          </div>
        </body>
      </html>
    `,
  }),

  // Booking confirmation
  bookingConfirmation: (
    name: string,
    email: string,
    coachName: string,
    date: string,
    time: string
  ) => ({
    to: email,
    subject: `Session Confirmed: ${date} at ${time} ✅`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Session Confirmed! ✅</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your personal training session has been booked successfully!</p>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #f97316;">📅 Session Details</h3>
              <p><strong>Coach:</strong> ${coachName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Duration:</strong> 60 minutes</p>
            </div>
            <p><strong>Tips for your session:</strong></p>
            <ul>
              <li>Arrive 10 minutes early to warm up</li>
              <li>Bring water and a towel</li>
              <li>Wear comfortable workout clothes</li>
              <li>Eat a light meal 1-2 hours before</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/member/bookings" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View My Bookings</a>
            </div>
            <p>Need to reschedule? You can cancel up to 24 hours before your session from your member portal.</p>
            <p>See you at the gym! 💪</p>
            <p>- The Grams Gym Team</p>
          </div>
        </body>
      </html>
    `,
  }),

  // Booking cancellation
  bookingCancellation: (
    name: string,
    email: string,
    coachName: string,
    date: string,
    time: string
  ) => ({
    to: email,
    subject: `Session Cancelled: ${date} at ${time}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #64748b, #475569); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Session Cancelled</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your personal training session has been cancelled.</p>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #64748b;">❌ Cancelled Session</h3>
              <p><strong>Coach:</strong> ${coachName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
            </div>
            <p>Your session credit has been restored to your package.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/member/book" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Book New Session</a>
            </div>
            <p>We hope to see you soon!</p>
            <p>- The Grams Gym Team</p>
          </div>
        </body>
      </html>
    `,
  }),

  // Session reminder (24 hours before)
  sessionReminder: (
    name: string,
    email: string,
    coachName: string,
    date: string,
    time: string
  ) => ({
    to: email,
    subject: `Reminder: PT Session Tomorrow at ${time} ⏰`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Session Reminder ⏰</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>This is a friendly reminder about your upcoming personal training session!</p>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #3b82f6;">📅 Tomorrow's Session</h3>
              <p><strong>Coach:</strong> ${coachName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Duration:</strong> 60 minutes</p>
            </div>
            <p><strong>Don't forget to:</strong></p>
            <ul>
              <li>Get a good night's sleep</li>
              <li>Stay hydrated</li>
              <li>Prepare your gym bag</li>
            </ul>
            <p>Can't make it? Please cancel at least 24 hours in advance from your member portal.</p>
            <p>See you tomorrow! 💪</p>
            <p>- The Grams Gym Team</p>
          </div>
        </body>
      </html>
    `,
  }),

  // Subscription expiring soon
  subscriptionExpiring: (
    name: string,
    email: string,
    subscriptionType: string,
    expiryDate: string,
    daysLeft: number
  ) => ({
    to: email,
    subject: `Your ${subscriptionType} expires in ${daysLeft} days ⚠️`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #eab308, #ca8a04); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Subscription Expiring Soon ⚠️</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your <strong>${subscriptionType}</strong> is expiring soon!</p>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="font-size: 48px; margin: 0; color: #eab308;">${daysLeft}</p>
              <p style="margin: 0; color: #666;">days remaining</p>
              <p style="margin-top: 10px;"><strong>Expires:</strong> ${expiryDate}</p>
            </div>
            <p>Don't let your fitness momentum stop! Renew now to continue your journey with us.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Renewal Options</a>
            </div>
            <p>Have questions? Contact us on WhatsApp or visit the gym!</p>
            <p>- The Grams Gym Team</p>
          </div>
        </body>
      </html>
    `,
  }),

  // PT sessions running low
  ptSessionsLow: (
    name: string,
    email: string,
    remainingSessions: number
  ) => ({
    to: email,
    subject: `Only ${remainingSessions} PT sessions remaining! 📊`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">PT Sessions Running Low 📊</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>You're doing great with your training! Just a heads up that your PT sessions are running low.</p>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="font-size: 48px; margin: 0; color: #f97316;">${remainingSessions}</p>
              <p style="margin: 0; color: #666;">sessions remaining</p>
            </div>
            <p>Keep the momentum going! Check out our PT packages to continue your transformation.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View PT Packages</a>
            </div>
            <p>Talk to your coach about which package is best for your goals!</p>
            <p>- The Grams Gym Team</p>
          </div>
        </body>
      </html>
    `,
  }),

  // Coach notification: New booking
  coachNewBooking: (
    coachEmail: string,
    coachName: string,
    memberName: string,
    date: string,
    time: string
  ) => ({
    to: coachEmail,
    subject: `New Session Booked: ${memberName} on ${date}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">New Session Booked! 📅</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi <strong>${coachName}</strong>,</p>
            <p>A new personal training session has been booked with you!</p>
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #22c55e;">📅 Session Details</h3>
              <p><strong>Member:</strong> ${memberName}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
              <p><strong>Duration:</strong> 60 minutes</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/coach/bookings" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Schedule</a>
            </div>
            <p>- Grams Gym System</p>
          </div>
        </body>
      </html>
    `,
  }),
}

// Send email function
export async function sendEmail(template: {
  to: string
  subject: string
  html: string
}) {
  const resend = getResendClient()

  if (!resend) {
    console.log('Email not sent - RESEND_API_KEY not configured')
    console.log('Would send email:', { to: template.to, subject: template.subject })
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const { data, error } = await withTimeout(
      resend.emails.send({
        from: FROM_EMAIL,
        to: template.to,
        subject: template.subject,
        html: template.html,
      }),
      EMAIL_TIMEOUT_MS,
      'Email service timeout'
    )

    if (error) {
      console.error('Failed to send email:', error)
      return { success: false, error: error.message }
    }

    console.log('Email sent successfully:', data)
    return { success: true, data }
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.error('Email service timeout:', error.message)
      return { success: false, error: 'Email service timeout' }
    }
    console.error('Email send error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
