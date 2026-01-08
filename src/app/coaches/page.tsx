import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

// Revalidate coaches data every hour
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Our Coaches',
  description: 'Meet our certified personal trainers at Grams Gym, Amman. Expert coaches specializing in strength, weight loss, functional training, and sports performance.',
  openGraph: {
    title: 'Our Coaches | Certified Personal Trainers at Grams Gym',
    description: 'Meet our certified personal trainers at Grams Gym, Amman.',
  },
}
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import {
  Users,
  Award,
  Dumbbell,
  ChevronRight,
  Star,
  Instagram,
} from 'lucide-react'

export default async function CoachesPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any

  // Get all active coaches
  const { data: coaches } = await client
    .from('coaches')
    .select('*')
    .order('name_en', { ascending: true })

  // Default coaches if none in database
  const defaultCoaches = [
    {
      id: '1',
      name_en: 'Ahmad Grams',
      name_ar: 'أحمد جرامز',
      specialization_en: 'Strength & Conditioning',
      specialization_ar: 'القوة والتكييف',
      bio_en: 'Head coach with over 10 years of experience in strength training and bodybuilding.',
      bio_ar: 'المدرب الرئيسي مع أكثر من 10 سنوات من الخبرة في تدريب القوة وكمال الأجسام.',
      certifications: ['NASM-CPT', 'CrossFit L2'],
    },
    {
      id: '2',
      name_en: 'Mohammad Grams',
      name_ar: 'محمد جرامز',
      specialization_en: 'Weight Loss & Nutrition',
      specialization_ar: 'فقدان الوزن والتغذية',
      bio_en: 'Certified nutritionist specializing in body transformation and sustainable weight loss.',
      bio_ar: 'أخصائي تغذية معتمد متخصص في تحويل الجسم وفقدان الوزن المستدام.',
      certifications: ['ACE-CPT', 'Precision Nutrition'],
    },
    {
      id: '3',
      name_en: 'Khaled Grams',
      name_ar: 'خالد جرامز',
      specialization_en: 'Functional Training',
      specialization_ar: 'التدريب الوظيفي',
      bio_en: 'Expert in functional fitness and mobility training for everyday athletes.',
      bio_ar: 'خبير في اللياقة الوظيفية وتدريب الحركة للرياضيين اليوميين.',
      certifications: ['NSCA-CSCS', 'FMS Certified'],
    },
    {
      id: '4',
      name_en: 'Omar Grams',
      name_ar: 'عمر جرامز',
      specialization_en: 'Sports Performance',
      specialization_ar: 'الأداء الرياضي',
      bio_en: 'Former athlete specializing in sports-specific training and performance enhancement.',
      bio_ar: 'رياضي سابق متخصص في التدريب الرياضي المحدد وتحسين الأداء.',
      certifications: ['NASM-PES', 'USA Weightlifting'],
    },
  ]

  const displayCoaches = coaches && coaches.length > 0 ? coaches : defaultCoaches

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Expert Team</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our <span className="text-primary">Coaches</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our certified trainers are dedicated to helping you achieve your fitness goals
              with personalized attention and expert guidance.
            </p>
          </div>
        </section>

        {/* Family Introduction */}
        <section className="py-16 border-b border-border">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">A Family of Fitness Experts</h2>
              <p className="text-muted-foreground">
                Grams Gym is proudly run by a family of certified fitness professionals.
                Each coach brings unique expertise while sharing a common commitment to
                your success. When you train with us, you become part of our family.
              </p>
            </div>
          </div>
        </section>

        {/* Coaches Grid */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {displayCoaches.map((coach: {
                id: string
                name_en: string
                name_ar: string
                specialization_en?: string
                specialization_ar?: string
                bio_en?: string
                bio_ar?: string
                profile_photo_url?: string
                certifications?: string[]
                instagram?: string
              }) => (
                <Card key={coach.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Photo */}
                      <div className="sm:w-1/3 bg-muted aspect-square sm:aspect-auto flex items-center justify-center">
                        <Avatar className="h-32 w-32 sm:h-full sm:w-full sm:rounded-none">
                          <AvatarImage
                            src={coach.profile_photo_url || undefined}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-4xl sm:rounded-none sm:h-full sm:w-full">
                            {coach.name_en.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Info */}
                      <div className="sm:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold">{coach.name_en}</h3>
                            <p className="text-sm text-muted-foreground" dir="rtl">
                              {coach.name_ar}
                            </p>
                          </div>
                          {coach.instagram && (
                            <a
                              href={`https://instagram.com/${coach.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-500 hover:text-pink-600"
                            >
                              <Instagram className="h-5 w-5" />
                            </a>
                          )}
                        </div>

                        {coach.specialization_en && (
                          <Badge variant="secondary" className="mb-3">
                            <Dumbbell className="h-3 w-3 mr-1" />
                            {coach.specialization_en}
                          </Badge>
                        )}

                        {coach.bio_en && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {coach.bio_en}
                          </p>
                        )}

                        {coach.certifications && coach.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {coach.certifications.map((cert: string) => (
                              <Badge key={cert} variant="outline" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Train With Us */}
        <section className="py-20 bg-card border-y border-border">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Train With Us?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our coaches are committed to your success
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Certified Experts</h3>
                <p className="text-sm text-muted-foreground">
                  Internationally certified with ongoing education
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Personalized Approach</h3>
                <p className="text-sm text-muted-foreground">
                  Custom programs tailored to your goals
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Proven Results</h3>
                <p className="text-sm text-muted-foreground">
                  Track record of successful transformations
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Flexible Training</h3>
                <p className="text-sm text-muted-foreground">
                  Sessions that fit your schedule
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Training?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Book a session with one of our expert coaches today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8">
                  Contact Us
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View PT Packages
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
