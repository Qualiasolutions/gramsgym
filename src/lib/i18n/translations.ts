export type Language = 'en' | 'ar'

export const translations = {
  // Navigation
  nav: {
    home: { en: 'Home', ar: 'الرئيسية' },
    about: { en: 'About', ar: 'عنا' },
    coaches: { en: 'Coaches', ar: 'المدربين' },
    pricing: { en: 'Pricing', ar: 'الأسعار' },
    contact: { en: 'Contact', ar: 'اتصل بنا' },
    signIn: { en: 'Sign In', ar: 'تسجيل الدخول' },
    signOut: { en: 'Sign Out', ar: 'تسجيل الخروج' },
    startToday: { en: 'Start Today', ar: 'ابدأ اليوم' },
  },

  // Common
  common: {
    learnMore: { en: 'Learn More', ar: 'اعرف المزيد' },
    viewAll: { en: 'View All', ar: 'عرض الكل' },
    bookNow: { en: 'Book Now', ar: 'احجز الآن' },
    getStarted: { en: 'Get Started', ar: 'ابدأ الآن' },
    readMore: { en: 'Read More', ar: 'اقرأ المزيد' },
    perMonth: { en: '/month', ar: '/شهرياً' },
    perSession: { en: '/session', ar: '/جلسة' },
    sessions: { en: 'sessions', ar: 'جلسات' },
    month: { en: 'month', ar: 'شهر' },
    months: { en: 'months', ar: 'أشهر' },
    popular: { en: 'Most Popular', ar: 'الأكثر شعبية' },
    bestValue: { en: 'Best Value', ar: 'أفضل قيمة' },
  },

  // Home Page
  home: {
    tagline: { en: 'Each Gram Matters', ar: 'كل جرام مهم' },
    heroTitle1: { en: 'Transform', ar: 'حوّل' },
    heroTitle2: { en: 'Your Body', ar: 'جسمك' },
    heroTitle3: { en: 'Transform', ar: 'حوّل' },
    heroTitle4: { en: 'Your Life', ar: 'حياتك' },
    heroDescription: {
      en: 'Where dedication meets excellence. Experience premium personal training that transforms not just your body, but your entire lifestyle.',
      ar: 'حيث يلتقي التفاني بالتميز. اختبر التدريب الشخصي المتميز الذي يحول ليس فقط جسمك، بل نمط حياتك بالكامل.'
    },
    exploreGym: { en: 'Explore Our Gym', ar: 'استكشف صالتنا' },
    viewPricing: { en: 'View Pricing', ar: 'عرض الأسعار' },
    whyChooseUs: { en: 'Why Choose Us', ar: 'لماذا تختارنا' },
    premiumExperience: { en: 'Premium Experience', ar: 'تجربة متميزة' },
    experienceDescription: {
      en: 'Every detail at Grams Gym is designed to help you achieve your fitness goals in an environment that inspires excellence.',
      ar: 'كل تفصيل في جرامز جيم مصمم لمساعدتك على تحقيق أهدافك الصحية في بيئة تلهم التميز.'
    },
    // Features
    expertCoaches: { en: 'Expert Coaches', ar: 'مدربين خبراء' },
    expertCoachesDesc: {
      en: 'Certified trainers with years of experience to guide your transformation journey.',
      ar: 'مدربين معتمدين بسنوات من الخبرة لتوجيه رحلة تحولك.'
    },
    modernEquipment: { en: 'Modern Equipment', ar: 'معدات حديثة' },
    modernEquipmentDesc: {
      en: 'State-of-the-art fitness equipment for optimal training results.',
      ar: 'معدات لياقة بدنية متطورة للحصول على أفضل النتائج.'
    },
    personalizedPlans: { en: 'Personalized Plans', ar: 'خطط مخصصة' },
    personalizedPlansDesc: {
      en: 'Custom workout and nutrition plans tailored to your unique goals.',
      ar: 'خطط تمارين وتغذية مخصصة حسب أهدافك الفريدة.'
    },
    premiumEnvironment: { en: 'Premium Environment', ar: 'بيئة متميزة' },
    premiumEnvironmentDesc: {
      en: 'A luxurious, clean space designed to motivate and inspire.',
      ar: 'مساحة فاخرة ونظيفة مصممة للتحفيز والإلهام.'
    },
    // About Preview
    ourStory: { en: 'Our Story', ar: 'قصتنا' },
    familyOwnedTitle: { en: 'Family-Owned Excellence', ar: 'تميز عائلي' },
    familyOwnedDesc: {
      en: 'Founded by the Grams family, we bring generations of fitness expertise and a personal touch to every member\'s journey. Our commitment goes beyond typical gym services—we build lasting relationships with everyone who walks through our doors.',
      ar: 'أسسها عائلة جرامز، نجلب أجيالاً من خبرة اللياقة البدنية ولمسة شخصية لرحلة كل عضو. التزامنا يتجاوز خدمات الصالات النموذجية—نبني علاقات دائمة مع كل من يدخل أبوابنا.'
    },
    discoverOurStory: { en: 'Discover Our Story', ar: 'اكتشف قصتنا' },
    yearsOfExcellence: { en: 'Years of Excellence', ar: 'سنوات من التميز' },
    happyMembers: { en: 'Happy Members', ar: 'أعضاء سعداء' },
    expertTrainers: { en: 'Expert Trainers', ar: 'مدربين خبراء' },
    // Pricing Preview
    membershipPlans: { en: 'Membership Plans', ar: 'خطط العضوية' },
    investInYourself: { en: 'Invest in Yourself', ar: 'استثمر في نفسك' },
    membershipDesc: {
      en: 'Choose the plan that fits your lifestyle and goals. All memberships include full gym access.',
      ar: 'اختر الخطة التي تناسب نمط حياتك وأهدافك. جميع العضويات تشمل وصولاً كاملاً للصالة.'
    },
    fullGymAccess: { en: 'Full gym access', ar: 'وصول كامل للصالة' },
    lockerRoom: { en: 'Locker room', ar: 'غرفة خلع الملابس' },
    freeParking: { en: 'Free parking', ar: 'موقف مجاني' },
    personalTraining: { en: 'Personal training', ar: 'تدريب شخصي' },
    nutritionGuidance: { en: 'Nutrition guidance', ar: 'إرشاد غذائي' },
    priorityBooking: { en: 'Priority booking', ar: 'حجز أولوية' },
    viewAllPlans: { en: 'View All Plans', ar: 'عرض جميع الخطط' },
    // CTA
    readyToTransform: { en: 'Ready to Transform?', ar: 'مستعد للتحول؟' },
    ctaDescription: {
      en: 'Join Grams Gym today and start your journey to a stronger, healthier you.',
      ar: 'انضم إلى جرامز جيم اليوم وابدأ رحلتك نحو نسخة أقوى وأكثر صحة منك.'
    },
    startYourJourney: { en: 'Start Your Journey', ar: 'ابدأ رحلتك' },
  },

  // About Page
  about: {
    tagline: { en: 'Our Story', ar: 'قصتنا' },
    title1: { en: 'Built on', ar: 'مبني على' },
    title2: { en: 'Family Values', ar: 'قيم عائلية' },
    description: {
      en: 'Four brothers united by a passion for fitness, dedicated to transforming lives one gram at a time.',
      ar: 'أربعة إخوة يجمعهم شغف اللياقة البدنية، مكرسين لتحويل الحياة جرامًا بعد جرام.'
    },
    ourBeginning: { en: 'Our Beginning', ar: 'بدايتنا' },
    beginningTitle: { en: 'From Passion to Purpose', ar: 'من الشغف إلى الهدف' },
    beginningDesc: {
      en: 'What started as a shared love for fitness among four brothers has grown into Amman\'s most dedicated training facility. We believe that every gram of effort counts—whether it\'s the weight you lift or the commitment you bring.',
      ar: 'ما بدأ كحب مشترك للياقة البدنية بين أربعة إخوة نما ليصبح أكثر مرافق التدريب تفانياً في عمان. نؤمن أن كل جرام من الجهد مهم—سواء كان الوزن الذي ترفعه أو الالتزام الذي تجلبه.'
    },
    // Timeline
    founded: { en: 'Founded', ar: 'التأسيس' },
    foundedDesc: { en: 'Grams Gym opens its doors in Amman', ar: 'جرامز جيم يفتتح أبوابه في عمان' },
    expansion: { en: 'Expansion', ar: 'التوسع' },
    expansionDesc: { en: 'Added personal training programs', ar: 'أضفنا برامج التدريب الشخصي' },
    growth: { en: 'Growth', ar: 'النمو' },
    growthDesc: { en: 'Reached 500+ active members', ar: 'وصلنا إلى أكثر من 500 عضو نشط' },
    today: { en: 'Today', ar: 'اليوم' },
    todayDesc: { en: 'Continuing to transform lives daily', ar: 'نستمر في تحويل الحياة يومياً' },
    // Values
    ourValues: { en: 'Our Values', ar: 'قيمنا' },
    whatDrivesUs: { en: 'What Drives Us', ar: 'ما يحركنا' },
    dedication: { en: 'Dedication', ar: 'التفاني' },
    dedicationDesc: { en: 'We\'re committed to your success as much as you are.', ar: 'نحن ملتزمون بنجاحك بقدر التزامك.' },
    family: { en: 'Family', ar: 'العائلة' },
    familyDesc: { en: 'Every member is part of our extended family.', ar: 'كل عضو هو جزء من عائلتنا الممتدة.' },
    excellence: { en: 'Excellence', ar: 'التميز' },
    excellenceDesc: { en: 'We strive for the best in everything we do.', ar: 'نسعى للأفضل في كل ما نفعله.' },
    results: { en: 'Results', ar: 'النتائج' },
    resultsDesc: { en: 'Your transformation is our ultimate measure of success.', ar: 'تحولك هو مقياسنا النهائي للنجاح.' },
    // Quote
    founderQuote: {
      en: '"At Grams Gym, we don\'t just train bodies—we build confidence, discipline, and lasting habits. Every member who walks through our doors becomes family."',
      ar: '"في جرامز جيم، نحن لا ندرب الأجسام فقط—نبني الثقة والانضباط والعادات الدائمة. كل عضو يدخل من أبوابنا يصبح عائلة."'
    },
    founderName: { en: 'Ahmad Grams', ar: 'أحمد جرامز' },
    founderTitle: { en: 'Founder & Head Coach', ar: 'المؤسس والمدرب الرئيسي' },
    // CTA
    joinFamily: { en: 'Join the Family', ar: 'انضم للعائلة' },
    joinFamilyDesc: {
      en: 'Ready to experience the Grams difference? Start your transformation journey with us today.',
      ar: 'مستعد لتجربة فرق جرامز؟ ابدأ رحلة تحولك معنا اليوم.'
    },
  },

  // Coaches Page
  coaches: {
    tagline: { en: 'Expert Guidance', ar: 'إرشاد خبير' },
    title1: { en: 'Meet Your', ar: 'تعرف على' },
    title2: { en: 'Coaches', ar: 'مدربيك' },
    description: {
      en: 'Four family members united by a passion for fitness, dedicated to helping you achieve your goals.',
      ar: 'أربعة أفراد من العائلة يجمعهم شغف اللياقة البدنية، مكرسين لمساعدتك على تحقيق أهدافك.'
    },
    // Stats
    expertCoaches: { en: 'Expert Coaches', ar: 'مدربين خبراء' },
    yearsCombined: { en: 'Years Combined', ar: 'سنوات مجتمعة' },
    certifications: { en: 'Certifications', ar: 'شهادات' },
    clientsHelped: { en: 'Clients Helped', ar: 'عملاء تمت مساعدتهم' },
    // Coach Cards
    headCoach: { en: 'Head Coach & Founder', ar: 'المدرب الرئيسي والمؤسس' },
    seniorCoach: { en: 'Senior Coach', ar: 'مدرب أول' },
    performanceCoach: { en: 'Performance Coach', ar: 'مدرب أداء' },
    fitnessCoach: { en: 'Fitness Coach', ar: 'مدرب لياقة' },
    specialization: { en: 'Specialization', ar: 'التخصص' },
    bookSession: { en: 'Book Session', ar: 'احجز جلسة' },
    // Why Train With Us
    theDifference: { en: 'The Difference', ar: 'الفرق' },
    whyTrainWithUs: { en: 'Why Train With', ar: 'لماذا تتدرب' },
    us: { en: 'Us?', ar: 'معنا؟' },
    whyTrainDesc: {
      en: 'Our coaches don\'t just count reps—they build relationships. As a family-owned gym, we take personal pride in every member\'s success.',
      ar: 'مدربونا لا يعدون التكرارات فقط—يبنون علاقات. كصالة مملوكة عائلياً، نفخر شخصياً بنجاح كل عضو.'
    },
    personalizedPrograms: { en: 'Personalized programs tailored to your goals', ar: 'برامج مخصصة حسب أهدافك' },
    nutritionIncluded: { en: 'Nutrition guidance included with coaching', ar: 'إرشاد غذائي مشمول مع التدريب' },
    flexibleScheduling: { en: 'Flexible scheduling that fits your life', ar: 'جدولة مرنة تناسب حياتك' },
    ongoingSupport: { en: 'Ongoing support and accountability', ar: 'دعم مستمر ومسؤولية' },
    // CTA
    readyToStart: { en: 'Ready to Start', ar: 'مستعد للبدء' },
    training: { en: 'Training?', ar: 'بالتدريب؟' },
    ctaDesc: {
      en: 'Book your first session and experience the Grams Gym difference',
      ar: 'احجز جلستك الأولى واختبر فرق جرامز جيم'
    },
    bookASession: { en: 'Book a Session', ar: 'احجز جلسة' },
  },

  // Pricing Page
  pricing: {
    tagline: { en: 'Membership Plans', ar: 'خطط العضوية' },
    title1: { en: 'Invest in', ar: 'استثمر في' },
    title2: { en: 'Your Health', ar: 'صحتك' },
    description: {
      en: 'Choose the plan that fits your lifestyle. All memberships include full gym access and locker room facilities.',
      ar: 'اختر الخطة التي تناسب نمط حياتك. جميع العضويات تشمل وصولاً كاملاً للصالة ومرافق غرفة الخلع.'
    },
    // Membership types
    monthly: { en: 'Monthly', ar: 'شهري' },
    quarterly: { en: 'Quarterly', ar: 'ربع سنوي' },
    biannual: { en: 'Bi-Annual', ar: 'نصف سنوي' },
    annual: { en: 'Annual', ar: 'سنوي' },
    // Features
    fullAccess: { en: 'Full gym access', ar: 'وصول كامل للصالة' },
    lockerFacilities: { en: 'Locker facilities', ar: 'مرافق الخزائن' },
    freeWifi: { en: 'Free WiFi', ar: 'واي فاي مجاني' },
    groupClasses: { en: 'Group classes', ar: 'حصص جماعية' },
    nutritionPlan: { en: 'Nutrition plan', ar: 'خطة غذائية' },
    guestPasses: { en: 'Guest passes', ar: 'تصاريح ضيوف' },
    prioritySupport: { en: 'Priority support', ar: 'دعم أولوية' },
    getMembership: { en: 'Get Membership', ar: 'احصل على العضوية' },
    // PT Section
    ptPackages: { en: 'Personal Training', ar: 'التدريب الشخصي' },
    ptTagline: { en: 'One-on-One Training', ar: 'تدريب فردي' },
    ptDescription: {
      en: 'Take your fitness to the next level with personalized coaching from our expert trainers.',
      ar: 'ارتقِ بلياقتك للمستوى التالي مع تدريب مخصص من مدربينا الخبراء.'
    },
    starterPack: { en: 'Starter Pack', ar: 'باقة البداية' },
    transformPack: { en: 'Transform Pack', ar: 'باقة التحول' },
    elitePack: { en: 'Elite Pack', ar: 'باقة النخبة' },
    ptSession: { en: 'PT session', ar: 'جلسة تدريب شخصي' },
    ptSessions: { en: 'PT sessions', ar: 'جلسات تدريب شخصي' },
    customWorkout: { en: 'Custom workout plan', ar: 'خطة تمرين مخصصة' },
    progressTracking: { en: 'Progress tracking', ar: 'تتبع التقدم' },
    bodyComposition: { en: 'Body composition analysis', ar: 'تحليل تكوين الجسم' },
    whatsappSupport: { en: 'WhatsApp support', ar: 'دعم واتساب' },
    mealPlanning: { en: 'Meal planning', ar: 'تخطيط الوجبات' },
    weeklyCheckins: { en: 'Weekly check-ins', ar: 'متابعة أسبوعية' },
    getStarted: { en: 'Get Started', ar: 'ابدأ الآن' },
    // What's Included
    whatsIncluded: { en: 'What\'s Included', ar: 'ما المشمول' },
    allMemberships: { en: 'All Memberships Include', ar: 'جميع العضويات تشمل' },
    includedDesc: {
      en: 'Every membership comes with these premium amenities to enhance your workout experience.',
      ar: 'كل عضوية تأتي مع هذه المرافق المتميزة لتعزيز تجربة تمرينك.'
    },
    premiumEquipment: { en: 'Premium Equipment', ar: 'معدات متميزة' },
    equipmentDesc: { en: 'State-of-the-art machines and free weights', ar: 'آلات حديثة وأوزان حرة' },
    cleanFacilities: { en: 'Clean Facilities', ar: 'مرافق نظيفة' },
    facilitiesDesc: { en: 'Sanitized equipment and spotless environment', ar: 'معدات معقمة وبيئة نظيفة' },
    flexibleHours: { en: 'Flexible Hours', ar: 'ساعات مرنة' },
    hoursDesc: { en: 'Open early morning to late night', ar: 'مفتوح من الصباح الباكر حتى الليل' },
    expertGuidance: { en: 'Expert Guidance', ar: 'إرشاد خبير' },
    guidanceDesc: { en: 'Staff available to help with form and technique', ar: 'طاقم متاح للمساعدة في الأداء والتقنية' },
    // CTA
    readyToStart: { en: 'Ready to Start?', ar: 'مستعد للبدء؟' },
    ctaDescription: {
      en: 'Visit us today for a free tour and consultation. No commitment required.',
      ar: 'زرنا اليوم لجولة مجانية واستشارة. لا يتطلب التزام.'
    },
    contactUs: { en: 'Contact Us', ar: 'اتصل بنا' },
  },

  // Contact Page
  contact: {
    tagline: { en: 'Get In Touch', ar: 'تواصل معنا' },
    title1: { en: 'Let\'s', ar: 'لنتحدث' },
    title2: { en: 'Talk', ar: 'معاً' },
    description: {
      en: 'Ready to start your fitness journey? Have questions? We\'d love to hear from you.',
      ar: 'مستعد لبدء رحلة لياقتك؟ لديك أسئلة؟ نود أن نسمع منك.'
    },
    // Form
    sendMessage: { en: 'Send a Message', ar: 'أرسل رسالة' },
    formDesc: { en: 'Fill out the form and we\'ll get back to you within 24 hours.', ar: 'املأ النموذج وسنعود إليك خلال 24 ساعة.' },
    firstName: { en: 'First Name', ar: 'الاسم الأول' },
    lastName: { en: 'Last Name', ar: 'اسم العائلة' },
    email: { en: 'Email', ar: 'البريد الإلكتروني' },
    phone: { en: 'Phone', ar: 'الهاتف' },
    interest: { en: 'Interest', ar: 'الاهتمام' },
    gymMembership: { en: 'Gym Membership', ar: 'عضوية الصالة' },
    personalTraining: { en: 'Personal Training', ar: 'التدريب الشخصي' },
    membershipPT: { en: 'Membership + PT', ar: 'عضوية + تدريب شخصي' },
    other: { en: 'Other', ar: 'أخرى' },
    message: { en: 'Message', ar: 'الرسالة' },
    messagePlaceholder: { en: 'Tell us about your fitness goals...', ar: 'أخبرنا عن أهدافك في اللياقة...' },
    send: { en: 'Send Message', ar: 'أرسل الرسالة' },
    sending: { en: 'Sending...', ar: 'جارٍ الإرسال...' },
    messageSent: { en: 'Message Sent!', ar: 'تم إرسال الرسالة!' },
    thankYou: { en: 'Thank you for reaching out. We\'ll be in touch soon.', ar: 'شكراً للتواصل. سنتصل بك قريباً.' },
    sendAnother: { en: 'Send another message', ar: 'أرسل رسالة أخرى' },
    // Contact Info
    contactInfo: { en: 'Contact Information', ar: 'معلومات الاتصال' },
    location: { en: 'Location', ar: 'الموقع' },
    workingHours: { en: 'Working Hours', ar: 'ساعات العمل' },
    satThurs: { en: 'Saturday - Thursday', ar: 'السبت - الخميس' },
    friday: { en: 'Friday', ar: 'الجمعة' },
    followUs: { en: 'Follow Us', ar: 'تابعنا' },
    visitUs: { en: 'Visit Us Today', ar: 'زرنا اليوم' },
    visitDesc: { en: 'Come see our facilities and meet our team. First visit is always free!', ar: 'تعال لرؤية مرافقنا ومقابلة فريقنا. الزيارة الأولى دائماً مجانية!' },
    viewPricing: { en: 'View Pricing', ar: 'عرض الأسعار' },
    mapPlaceholder: { en: 'Interactive map coming soon', ar: 'خريطة تفاعلية قريباً' },
  },

  // Footer
  footer: {
    tagline: { en: 'Each Gram Matters', ar: 'كل جرام مهم' },
    description: {
      en: 'Premium fitness training in Amman, Jordan. Where dedication meets excellence.',
      ar: 'تدريب لياقة متميز في عمان، الأردن. حيث يلتقي التفاني بالتميز.'
    },
    quickLinks: { en: 'Quick Links', ar: 'روابط سريعة' },
    services: { en: 'Services', ar: 'الخدمات' },
    gymMembership: { en: 'Gym Membership', ar: 'عضوية الصالة' },
    personalTraining: { en: 'Personal Training', ar: 'التدريب الشخصي' },
    nutritionPlans: { en: 'Nutrition Plans', ar: 'خطط التغذية' },
    groupClasses: { en: 'Group Classes', ar: 'حصص جماعية' },
    contactUs: { en: 'Contact Us', ar: 'اتصل بنا' },
    allRights: { en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' },
    developedBy: { en: 'Developed & Designed by', ar: 'تم تطويره وتصميمه بواسطة' },
  },

  // Member Dashboard
  member: {
    dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
    myProfile: { en: 'My Profile', ar: 'ملفي الشخصي' },
    subscriptions: { en: 'Subscriptions', ar: 'الاشتراكات' },
    bookSession: { en: 'Book Session', ar: 'احجز جلسة' },
    myBookings: { en: 'My Bookings', ar: 'حجوزاتي' },
    myCoach: { en: 'My Coach', ar: 'مدربي' },
    personalTrainer: { en: 'Personal Trainer', ar: 'مدرب شخصي' },
  },

  // Coach Dashboard
  coach: {
    dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
    members: { en: 'Members', ar: 'الأعضاء' },
    bookings: { en: 'Bookings', ar: 'الحجوزات' },
    mySchedule: { en: 'My Schedule', ar: 'جدولي' },
    subscriptions: { en: 'Subscriptions', ar: 'الاشتراكات' },
    notifications: { en: 'Notifications', ar: 'الإشعارات' },
    reports: { en: 'Reports', ar: 'التقارير' },
    settings: { en: 'Settings', ar: 'الإعدادات' },
  },

  // Language
  language: {
    switchTo: { en: 'العربية', ar: 'English' },
    english: { en: 'English', ar: 'الإنجليزية' },
    arabic: { en: 'Arabic', ar: 'العربية' },
  },
} as const

export type TranslationKey = keyof typeof translations
export type TranslationSection<K extends TranslationKey> = keyof typeof translations[K]

export function t<K extends TranslationKey, S extends TranslationSection<K>>(
  section: K,
  key: S,
  lang: Language
): string {
  const translation = translations[section][key] as { en: string; ar: string }
  return translation[lang]
}
