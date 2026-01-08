import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dumbbell,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  Target,
  Zap,
  Trophy
} from 'lucide-react'

export default async function HomePage() {
  const t = await getTranslations('home')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />

          {/* Animated shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="container relative z-10 text-center py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Dumbbell className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Amman, Jordan</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-foreground">EACH </span>
              <span className="text-primary">GRAM</span>
              <span className="text-foreground"> MATTERS</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              كل جرام مهم
            </p>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="text-lg px-8">
                  {t('hero.cta')}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  {t('hero.learnMore')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-card border-y border-border">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">{t('stats.members')}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4</div>
                <p className="text-muted-foreground">{t('stats.coaches')}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">16h</div>
                <p className="text-muted-foreground">Daily Hours</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10+</div>
                <p className="text-muted-foreground">{t('stats.years')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {t('whyUs.title')}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              لماذا جرامز جيم
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('whyUs.equipment.title')}</h3>
                  <p className="text-muted-foreground">{t('whyUs.equipment.description')}</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('whyUs.coaches.title')}</h3>
                  <p className="text-muted-foreground">{t('whyUs.coaches.description')}</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('whyUs.results.title')}</h3>
                  <p className="text-muted-foreground">{t('whyUs.results.description')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Coaches Preview */}
        <section className="py-20 bg-card border-y border-border">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {t('coaches.title')}
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              تعرف على مدربينا
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-square rounded-xl bg-muted overflow-hidden mb-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <span className="text-sm font-medium">View Profile</span>
                    </div>
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-center">Coach {i}</h3>
                  <p className="text-sm text-muted-foreground text-center">Specialty</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/coaches">
                <Button variant="outline">
                  {t('coaches.viewAll')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Hours & Location */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Hours */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{t('hours.title')}</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-lg bg-card border border-border">
                    <span className="font-medium">{t('hours.satWed')}</span>
                    <span className="text-primary font-semibold">7:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-card border border-border">
                    <span className="font-medium">{t('hours.thursday')}</span>
                    <span className="text-primary font-semibold">7:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-card border border-border">
                    <span className="font-medium">{t('hours.friday')}</span>
                    <span className="text-primary font-semibold">6:00 PM - 9:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{t('location.title')}</h2>
                </div>

                <div className="aspect-video rounded-xl bg-card border border-border overflow-hidden">
                  {/* Placeholder for Google Maps */}
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                      <p className="text-lg font-medium">{t('location.address')}</p>
                      <p className="text-muted-foreground">عمان، الأردن</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5 border-t border-border">
          <div className="container text-center">
            <Zap className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Join Grams Gym today and start your fitness journey with expert coaches.
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg px-8">
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
