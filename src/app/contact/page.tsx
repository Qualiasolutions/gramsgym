import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

// Revalidate contact info every hour
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Grams Gym in Amman, Jordan. Visit us, call, WhatsApp, or send a message. View our location and working hours.',
  openGraph: {
    title: 'Contact Grams Gym | Location, Hours & WhatsApp',
    description: 'Get in touch with Grams Gym in Amman, Jordan. Visit us, call, WhatsApp, or send a message.',
  },
}
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContactForm } from '@/components/contact/contact-form'
import { Card, CardContent } from '@/components/ui/card'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Instagram,
} from 'lucide-react'

export default async function ContactPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  // Get gym settings
  const { data: gymSettings } = await client
    .from('gym_settings')
    .select('*')
    .single()

  // Get working hours
  const { data: workingHours } = await client
    .from('gym_working_hours')
    .select('*')
    .order('day_of_week', { ascending: true })

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We&apos;d love to hear from you. Send us a message or visit us at the gym.
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-20">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                  <p className="text-muted-foreground mb-8">
                    Visit us at our gym, give us a call, or send us a message on WhatsApp.
                    We&apos;re here to help you start your fitness journey.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Location */}
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Location</h3>
                        <p className="text-muted-foreground">
                          {gymSettings?.address_en || 'Amman, Jordan'}
                        </p>
                        <p className="text-muted-foreground" dir="rtl">
                          {gymSettings?.address_ar || 'عمان، الأردن'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Phone */}
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <a
                          href={`tel:${gymSettings?.phone || '+962'}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {gymSettings?.phone || '+962 XX XXX XXXX'}
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* WhatsApp */}
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <MessageCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">WhatsApp</h3>
                        <a
                          href={`https://wa.me/${gymSettings?.whatsapp?.replace(/[^0-9]/g, '') || ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-green-500 transition-colors"
                        >
                          {gymSettings?.whatsapp || '+962 XX XXX XXXX'}
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Email */}
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <a
                          href={`mailto:${gymSettings?.email || 'info@gramsgym.com'}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {gymSettings?.email || 'info@gramsgym.com'}
                        </a>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Instagram */}
                  {gymSettings?.instagram && (
                    <Card>
                      <CardContent className="flex items-start gap-4 p-6">
                        <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
                          <Instagram className="h-6 w-6 text-pink-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Instagram</h3>
                          <a
                            href={`https://instagram.com/${gymSettings.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-pink-500 transition-colors"
                          >
                            {gymSettings.instagram}
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>

        {/* Working Hours */}
        <section className="py-20 bg-card border-y border-border">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 justify-center mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Working Hours</h2>
              </div>

              <div className="space-y-3">
                {workingHours && workingHours.length > 0 ? (
                  workingHours.map((hours: {
                    id: string
                    day_of_week: number
                    open_time: string | null
                    close_time: string | null
                    is_closed: boolean
                  }) => (
                    <div
                      key={hours.id}
                      className="flex justify-between items-center p-4 rounded-lg bg-background border border-border"
                    >
                      <span className="font-medium">{days[hours.day_of_week]}</span>
                      <span className={hours.is_closed ? 'text-muted-foreground' : 'text-primary font-semibold'}>
                        {hours.is_closed ? 'Closed' : `${hours.open_time} - ${hours.close_time}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-background border border-border">
                      <span className="font-medium">Saturday - Wednesday</span>
                      <span className="text-primary font-semibold">6:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-background border border-border">
                      <span className="font-medium">Thursday</span>
                      <span className="text-primary font-semibold">6:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-background border border-border">
                      <span className="font-medium">Friday</span>
                      <span className="text-muted-foreground">Closed</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20">
          <div className="container">
            <div className="aspect-[21/9] rounded-2xl bg-muted border border-border overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium">
                    {gymSettings?.address_en || 'Amman, Jordan'}
                  </p>
                  <p className="text-muted-foreground">
                    Google Maps integration coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
