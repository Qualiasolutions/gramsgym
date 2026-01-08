import { sendEmail, emailTemplates } from './email'
import { sendWhatsAppMessage, whatsappTemplates } from './whatsapp'

interface NotificationOptions {
  email?: boolean
  whatsapp?: boolean
}

interface MemberInfo {
  name: string
  email: string
  phone?: string
}

interface CoachInfo {
  name: string
  email: string
  phone?: string
}

interface BookingInfo {
  date: string
  time: string
  coachName: string
}

// Default: send both email and WhatsApp when available
const DEFAULT_OPTIONS: NotificationOptions = {
  email: true,
  whatsapp: true,
}

/**
 * Send welcome notification to new member
 */
export async function notifyWelcomeMember(
  member: MemberInfo,
  options: NotificationOptions = DEFAULT_OPTIONS
) {
  const results = { email: false, whatsapp: false }

  if (options.email && member.email) {
    const template = emailTemplates.welcomeMember(member.name, member.email)
    const result = await sendEmail(template)
    results.email = result.success
  }

  if (options.whatsapp && member.phone) {
    const message = whatsappTemplates.welcomeMember(member.name)
    const result = await sendWhatsAppMessage(member.phone, message)
    results.whatsapp = result.success
  }

  return results
}

/**
 * Send booking confirmation to member
 */
export async function notifyBookingConfirmation(
  member: MemberInfo,
  booking: BookingInfo,
  options: NotificationOptions = DEFAULT_OPTIONS
) {
  const results = { email: false, whatsapp: false }

  if (options.email && member.email) {
    const template = emailTemplates.bookingConfirmation(
      member.name,
      member.email,
      booking.coachName,
      booking.date,
      booking.time
    )
    const result = await sendEmail(template)
    results.email = result.success
  }

  if (options.whatsapp && member.phone) {
    const message = whatsappTemplates.bookingConfirmation(
      member.name,
      booking.coachName,
      booking.date,
      booking.time
    )
    const result = await sendWhatsAppMessage(member.phone, message)
    results.whatsapp = result.success
  }

  return results
}

/**
 * Send booking cancellation to member
 */
export async function notifyBookingCancellation(
  member: MemberInfo,
  booking: BookingInfo,
  options: NotificationOptions = DEFAULT_OPTIONS
) {
  const results = { email: false, whatsapp: false }

  if (options.email && member.email) {
    const template = emailTemplates.bookingCancellation(
      member.name,
      member.email,
      booking.coachName,
      booking.date,
      booking.time
    )
    const result = await sendEmail(template)
    results.email = result.success
  }

  if (options.whatsapp && member.phone) {
    const message = whatsappTemplates.bookingCancellation(
      member.name,
      booking.date,
      booking.time
    )
    const result = await sendWhatsAppMessage(member.phone, message)
    results.whatsapp = result.success
  }

  return results
}

/**
 * Send session reminder (24 hours before)
 */
export async function notifySessionReminder(
  member: MemberInfo,
  booking: BookingInfo,
  options: NotificationOptions = DEFAULT_OPTIONS
) {
  const results = { email: false, whatsapp: false }

  if (options.email && member.email) {
    const template = emailTemplates.sessionReminder(
      member.name,
      member.email,
      booking.coachName,
      booking.date,
      booking.time
    )
    const result = await sendEmail(template)
    results.email = result.success
  }

  if (options.whatsapp && member.phone) {
    const message = whatsappTemplates.sessionReminder(
      member.name,
      booking.coachName,
      booking.date,
      booking.time
    )
    const result = await sendWhatsAppMessage(member.phone, message)
    results.whatsapp = result.success
  }

  return results
}

/**
 * Send subscription expiring notification
 */
export async function notifySubscriptionExpiring(
  member: MemberInfo,
  subscriptionType: string,
  expiryDate: string,
  daysLeft: number,
  options: NotificationOptions = DEFAULT_OPTIONS
) {
  const results = { email: false, whatsapp: false }

  if (options.email && member.email) {
    const template = emailTemplates.subscriptionExpiring(
      member.name,
      member.email,
      subscriptionType,
      expiryDate,
      daysLeft
    )
    const result = await sendEmail(template)
    results.email = result.success
  }

  if (options.whatsapp && member.phone) {
    const message = whatsappTemplates.subscriptionExpiring(
      member.name,
      subscriptionType,
      daysLeft
    )
    const result = await sendWhatsAppMessage(member.phone, message)
    results.whatsapp = result.success
  }

  return results
}

/**
 * Send PT sessions running low notification
 */
export async function notifyPTSessionsLow(
  member: MemberInfo,
  remainingSessions: number,
  options: NotificationOptions = DEFAULT_OPTIONS
) {
  const results = { email: false, whatsapp: false }

  if (options.email && member.email) {
    const template = emailTemplates.ptSessionsLow(
      member.name,
      member.email,
      remainingSessions
    )
    const result = await sendEmail(template)
    results.email = result.success
  }

  if (options.whatsapp && member.phone) {
    const message = whatsappTemplates.ptSessionsLow(member.name, remainingSessions)
    const result = await sendWhatsAppMessage(member.phone, message)
    results.whatsapp = result.success
  }

  return results
}

/**
 * Notify coach about new booking
 */
export async function notifyCoachNewBooking(
  coach: CoachInfo,
  memberName: string,
  booking: { date: string; time: string },
  options: NotificationOptions = DEFAULT_OPTIONS
) {
  const results = { email: false, whatsapp: false }

  if (options.email && coach.email) {
    const template = emailTemplates.coachNewBooking(
      coach.email,
      coach.name,
      memberName,
      booking.date,
      booking.time
    )
    const result = await sendEmail(template)
    results.email = result.success
  }

  if (options.whatsapp && coach.phone) {
    const message = whatsappTemplates.coachNewBooking(
      coach.name,
      memberName,
      booking.date,
      booking.time
    )
    const result = await sendWhatsAppMessage(coach.phone, message)
    results.whatsapp = result.success
  }

  return results
}

/**
 * Notify coach about cancelled booking
 */
export async function notifyCoachBookingCancelled(
  coach: CoachInfo,
  memberName: string,
  booking: { date: string; time: string },
  options: NotificationOptions = DEFAULT_OPTIONS
) {
  const results = { email: false, whatsapp: false }

  if (options.whatsapp && coach.phone) {
    const message = whatsappTemplates.coachBookingCancelled(
      coach.name,
      memberName,
      booking.date,
      booking.time
    )
    const result = await sendWhatsAppMessage(coach.phone, message)
    results.whatsapp = result.success
  }

  return results
}

// Re-export for direct access if needed
export { sendEmail, emailTemplates } from './email'
export { sendWhatsAppMessage, whatsappTemplates } from './whatsapp'
