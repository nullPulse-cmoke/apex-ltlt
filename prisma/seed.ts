import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.xpLedger.deleteMany()
  await prisma.application.deleteMany()
  await prisma.program.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const passwordHash = await bcrypt.hash('password123', 12)

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@apex.uz',
        passwordHash,
        fullName: 'Admin User',
        role: 'ADMIN',
        tier: 'GOLD_LEAD',
        totalXp: 1000,
        bio: 'APEX Platform Administrator.',
        region: 'TASHKENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'founder@apex.uz',
        passwordHash,
        fullName: 'Founder / CEO',
        role: 'ADMIN',
        tier: 'GOLD_LEAD',
        totalXp: 1000,
        bio: 'APEX Founder & Chief Executive Officer.',
        region: 'TASHKENT',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sardor@apex.uz',
        passwordHash,
        fullName: 'Sardor Karimov',
        telegramHandle: '@sardor_dev',
        region: 'TASHKENT',
        role: 'FULLSTACK',
        tier: 'GOLD_LEAD',
        totalXp: 1250,
        bio: 'Full-stack developer passionate about building solutions for local businesses.',
        techStack: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Next.js']),
        githubUrl: 'https://github.com/sardor',
      },
    }),
    prisma.user.create({
      data: {
        email: 'malika@apex.uz',
        passwordHash,
        fullName: 'Malika Rahimova',
        telegramHandle: '@malika_design',
        region: 'SAMARKAND',
        role: 'DESIGNER',
        tier: 'GOLD_LEAD',
        totalXp: 780,
        bio: 'UI/UX designer crafting beautiful digital experiences.',
        techStack: JSON.stringify(['Figma', 'Adobe XD', 'Tailwind CSS', 'Framer']),
      },
    }),
    prisma.user.create({
      data: {
        email: 'aziz@apex.uz',
        passwordHash,
        fullName: 'Aziz Usmanov',
        telegramHandle: '@aziz_backend',
        region: 'BUKHARA',
        role: 'BACKEND',
        tier: 'SILVER',
        totalXp: 420,
        bio: 'Backend engineer focused on scalable APIs and databases.',
        techStack: JSON.stringify(['Python', 'Django', 'PostgreSQL', 'Docker']),
      },
    }),
    prisma.user.create({
      data: {
        email: 'nilufar@apex.uz',
        passwordHash,
        fullName: 'Nilufar Toshmatova',
        telegramHandle: '@nilu_frontend',
        region: 'FERGANA',
        role: 'FRONTEND',
        tier: 'SILVER',
        totalXp: 310,
        bio: 'Frontend developer who loves clean, responsive UIs.',
        techStack: JSON.stringify(['React', 'Vue.js', 'CSS', 'JavaScript']),
      },
    }),
    prisma.user.create({
      data: {
        email: 'bekzod@apex.uz',
        passwordHash,
        fullName: 'Bekzod Mirzayev',
        telegramHandle: '@bekzod_mobile',
        region: 'TASHKENT',
        role: 'MOBILE',
        tier: 'BRONZE',
        totalXp: 150,
        bio: 'Mobile developer building cross-platform apps.',
        techStack: JSON.stringify(['React Native', 'Flutter', 'Firebase']),
      },
    }),
    prisma.user.create({
      data: {
        email: 'dildora@apex.uz',
        passwordHash,
        fullName: 'Dildora Khamidova',
        telegramHandle: '@dildora_pm',
        region: 'NAMANGAN',
        role: 'PM',
        tier: 'GOLD_LEAD',
        totalXp: 650,
        bio: 'Project manager keeping teams aligned and shipping.',
        techStack: JSON.stringify(['Jira', 'Notion', 'Slack', 'Figma']),
      },
    }),
    prisma.user.create({
      data: {
        email: 'jahongir@apex.uz',
        passwordHash,
        fullName: 'Jahongir Abdullayev',
        telegramHandle: '@jahongir_devops',
        region: 'JIZZAKH',
        role: 'DEVOPS',
        tier: 'SILVER',
        totalXp: 380,
        bio: 'DevOps engineer automating all the things.',
        techStack: JSON.stringify(['AWS', 'Docker', 'Kubernetes', 'GitHub Actions']),
      },
    }),
    prisma.user.create({
      data: {
        email: 'feruza@apex.uz',
        passwordHash,
        fullName: 'Feruza Normatova',
        telegramHandle: '@feruza_qa',
        region: 'ANDIJAN',
        role: 'QA',
        tier: 'BRONZE',
        totalXp: 90,
        bio: 'QA tester ensuring quality in every release.',
        techStack: JSON.stringify(['Selenium', 'Cypress', 'Postman', 'Jest']),
      },
    }),
    prisma.user.create({
      data: {
        email: 'otabek@apex.uz',
        passwordHash,
        fullName: 'Otabek Sobirov',
        telegramHandle: '@otabek_full',
        region: 'KASHKADARYA',
        role: 'FULLSTACK',
        tier: 'BRONZE',
        totalXp: 175,
        bio: 'Aspiring full-stack developer eager to learn.',
        techStack: JSON.stringify(['HTML', 'CSS', 'JavaScript', 'Node.js']),
      },
    }),
    prisma.user.create({
      data: {
        email: 'demo@apex.uz',
        passwordHash,
        fullName: 'Demo User',
        telegramHandle: '@demo_user',
        region: 'TASHKENT',
        role: 'FRONTEND',
        tier: 'BRONZE',
        totalXp: 50,
        bio: 'Demo account for testing the platform.',
        techStack: JSON.stringify(['React', 'TypeScript']),
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create programs
  const programs = await Promise.all([
    prisma.program.create({
      data: {
        title: 'Cafe Digital Menu Sprint',
        slug: 'cafe-digital-menu',
        description: 'Build a modern, responsive QR-code digital menu for a popular cafe in Tashkent. Features include multi-language support (Uzbek, Russian, English), beautiful food photography layout, real-time menu updates, and integration with the restaurant POS system.',
        clientType: 'RESTAURANT',
        techStack: JSON.stringify(['Next.js', 'Tailwind CSS', 'PostgreSQL', 'Prisma']),
        weeklyHours: 10,
        status: 'RECRUITING',
        maxTeamSize: 4,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Dental Clinic Web Platform',
        slug: 'dental-clinic-web',
        description: 'Create a professional website and appointment booking system for a dental clinic in Samarkand. Includes online scheduling, patient portal, treatment gallery, and SMS notification integration.',
        clientType: 'CLINIC',
        techStack: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Twilio']),
        weeklyHours: 12,
        status: 'IN_PROGRESS',
        maxTeamSize: 5,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Telegram Bot for Local Bakery',
        slug: 'bakery-telegram-bot',
        description: 'Develop a Telegram bot for a local bakery that handles online ordering, delivery tracking, loyalty rewards, and daily specials notifications. Integrate with payment systems.',
        clientType: 'RESTAURANT',
        techStack: JSON.stringify(['Python', 'aiogram', 'PostgreSQL', 'Redis']),
        weeklyHours: 8,
        status: 'RECRUITING',
        maxTeamSize: 3,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Fashion Boutique E-commerce',
        slug: 'fashion-ecommerce',
        description: 'Build a stylish e-commerce website for a fashion boutique in Bukhara. Features include product catalog, shopping cart, size guide, order management, and Instagram feed integration.',
        clientType: 'RETAIL',
        techStack: JSON.stringify(['Next.js', 'Stripe', 'Sanity CMS', 'Tailwind CSS']),
        weeklyHours: 15,
        status: 'RECRUITING',
        maxTeamSize: 5,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Language School Dashboard',
        slug: 'language-school-dashboard',
        description: 'Create an admin dashboard for a language school to manage students, teachers, class schedules, attendance tracking, and payment records. Includes parent notification system.',
        clientType: 'EDUCATION',
        techStack: JSON.stringify(['Vue.js', 'Express', 'PostgreSQL', 'Chart.js']),
        weeklyHours: 10,
        status: 'COMPLETED',
        maxTeamSize: 4,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Auto Service Booking System',
        slug: 'auto-service-booking',
        description: 'Build a booking system for an auto service center. Customers can book appointments, view service history, get price estimates, and receive status updates via Telegram.',
        clientType: 'SERVICES',
        techStack: JSON.stringify(['React', 'FastAPI', 'PostgreSQL', 'Telegram API']),
        weeklyHours: 8,
        status: 'IN_PROGRESS',
        maxTeamSize: 4,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Pharmacy Inventory & Sales',
        slug: 'pharmacy-inventory',
        description: 'Develop a web-based inventory management and point-of-sale system for a chain of pharmacies. Track stock levels, expiration dates, sales analytics, and supplier orders.',
        clientType: 'RETAIL',
        techStack: JSON.stringify(['Next.js', 'tRPC', 'Prisma', 'PostgreSQL']),
        weeklyHours: 12,
        status: 'RECRUITING',
        maxTeamSize: 5,
      },
    }),
    prisma.program.create({
      data: {
        title: 'Gym Membership Portal',
        slug: 'gym-membership-portal',
        description: 'Create a membership management portal for a fitness center. Features include member registration, class scheduling, trainer profiles, payment processing, and attendance analytics.',
        clientType: 'SERVICES',
        techStack: JSON.stringify(['React', 'Supabase', 'Tailwind CSS', 'Stripe']),
        weeklyHours: 10,
        status: 'RECRUITING',
        maxTeamSize: 4,
      },
    }),
  ])

  console.log(`✅ Created ${programs.length} programs`)

  // Create some applications
  await Promise.all([
    prisma.application.create({
      data: {
        userId: users[0].id,
        programId: programs[1].id,
        status: 'ACCEPTED',
        coverLetter: 'I have extensive experience with React and Node.js. I built similar systems before.',
        telegramGroupLink: 'https://t.me/+abc123dental',
      },
    }),
    prisma.application.create({
      data: {
        userId: users[1].id,
        programId: programs[1].id,
        status: 'ACCEPTED',
        coverLetter: 'As a UI/UX designer, I can create an amazing patient-facing interface.',
        telegramGroupLink: 'https://t.me/+abc123dental',
      },
    }),
    prisma.application.create({
      data: {
        userId: users[0].id,
        programId: programs[4].id,
        status: 'ACCEPTED',
        coverLetter: 'Would love to contribute to the language school project.',
        telegramGroupLink: 'https://t.me/+xyz789school',
      },
    }),
    prisma.application.create({
      data: {
        userId: users[2].id,
        programId: programs[5].id,
        status: 'ACCEPTED',
        coverLetter: 'FastAPI is my specialty. Happy to lead the backend.',
      },
    }),
    prisma.application.create({
      data: {
        userId: users[3].id,
        programId: programs[0].id,
        status: 'PENDING',
        coverLetter: 'I love building beautiful restaurant experiences on the web!',
      },
    }),
    prisma.application.create({
      data: {
        userId: users[4].id,
        programId: programs[0].id,
        status: 'IN_REVIEW',
        coverLetter: 'I can help with mobile-responsive development.',
      },
    }),
    prisma.application.create({
      data: {
        userId: users[9].id,
        programId: programs[0].id,
        status: 'PENDING',
        coverLetter: 'Excited to work on the cafe menu project!',
      },
    }),
  ])

  console.log('✅ Created sample applications')

  // Create XP ledger entries
  await Promise.all([
    // Sardor (1250 XP)
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 100, reason: 'Deployed dental clinic website', category: 'WEBSITE_DEPLOY', programId: programs[1].id } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 100, reason: 'Deployed language school dashboard', category: 'WEBSITE_DEPLOY', programId: programs[4].id } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 100, reason: 'Deployed auto service booking', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 50, reason: 'Built Telegram notification system', category: 'BOT_FEATURE' } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 50, reason: 'Built appointment booking bot', category: 'BOT_FEATURE' } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 25, reason: 'Reviewed PR #42', category: 'CODE_REVIEW' } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 25, reason: 'Reviewed PR #56', category: 'CODE_REVIEW' } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 50, reason: 'Founder recognition bonus', category: 'BONUS' } }),
    // Extra entries to reach ~1250
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 100, reason: 'Deployed bakery ordering system', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 100, reason: 'Deployed pharmacy POS', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 100, reason: 'Deployed gym portal', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 100, reason: 'Deployed fashion boutique', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 100, reason: 'Deployed cafe menu system', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 50, reason: 'Outstanding mentor bonus', category: 'BONUS' } }),
    prisma.xpLedger.create({ data: { userId: users[0].id, amount: 100, reason: 'Deployed client portal', category: 'WEBSITE_DEPLOY' } }),

    // Malika (780 XP)
    prisma.xpLedger.create({ data: { userId: users[1].id, amount: 100, reason: 'Designed dental clinic website', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[1].id, amount: 100, reason: 'Designed fashion boutique', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[1].id, amount: 100, reason: 'Designed gym portal', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[1].id, amount: 100, reason: 'Designed language school dashboard', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[1].id, amount: 100, reason: 'Designed pharmacy system', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[1].id, amount: 100, reason: 'Designed cafe menu', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[1].id, amount: 25, reason: 'Design review #12', category: 'CODE_REVIEW' } }),
    prisma.xpLedger.create({ data: { userId: users[1].id, amount: 25, reason: 'Design review #15', category: 'CODE_REVIEW' } }),
    prisma.xpLedger.create({ data: { userId: users[1].id, amount: 50, reason: 'Design excellence bonus', category: 'BONUS' } }),
    prisma.xpLedger.create({ data: { userId: users[1].id, amount: 80, reason: 'Created brand kit for 3 clients', category: 'BONUS' } }),

    // Aziz (420 XP)
    prisma.xpLedger.create({ data: { userId: users[2].id, amount: 100, reason: 'Deployed auto service API', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[2].id, amount: 100, reason: 'Deployed booking backend', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[2].id, amount: 50, reason: 'Built notification service', category: 'BOT_FEATURE' } }),
    prisma.xpLedger.create({ data: { userId: users[2].id, amount: 50, reason: 'Built analytics pipeline', category: 'BOT_FEATURE' } }),
    prisma.xpLedger.create({ data: { userId: users[2].id, amount: 25, reason: 'Reviewed API designs', category: 'CODE_REVIEW' } }),
    prisma.xpLedger.create({ data: { userId: users[2].id, amount: 25, reason: 'Reviewed database migrations', category: 'CODE_REVIEW' } }),
    prisma.xpLedger.create({ data: { userId: users[2].id, amount: 50, reason: 'Backend lead bonus', category: 'BONUS' } }),
    prisma.xpLedger.create({ data: { userId: users[2].id, amount: 20, reason: 'Extra contributions', category: 'BONUS' } }),

    // Dildora (650 XP)
    prisma.xpLedger.create({ data: { userId: users[5].id, amount: 100, reason: 'Managed dental clinic launch', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[5].id, amount: 100, reason: 'Managed language school launch', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[5].id, amount: 100, reason: 'Managed auto service launch', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[5].id, amount: 100, reason: 'Managed fashion boutique launch', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[5].id, amount: 100, reason: 'Managed bakery bot launch', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[5].id, amount: 50, reason: 'Sprint coordination excellence', category: 'BONUS' } }),
    prisma.xpLedger.create({ data: { userId: users[5].id, amount: 50, reason: 'Client satisfaction bonus', category: 'BONUS' } }),
    prisma.xpLedger.create({ data: { userId: users[5].id, amount: 50, reason: 'Team leadership bonus', category: 'BONUS' } }),

    // Others with smaller amounts
    prisma.xpLedger.create({ data: { userId: users[3].id, amount: 100, reason: 'Deployed landing page', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[3].id, amount: 100, reason: 'Deployed portfolio site', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[3].id, amount: 50, reason: 'Component library contribution', category: 'BOT_FEATURE' } }),
    prisma.xpLedger.create({ data: { userId: users[3].id, amount: 25, reason: 'CSS review', category: 'CODE_REVIEW' } }),
    prisma.xpLedger.create({ data: { userId: users[3].id, amount: 35, reason: 'Extra frontend work', category: 'BONUS' } }),

    prisma.xpLedger.create({ data: { userId: users[4].id, amount: 100, reason: 'Deployed mobile companion app', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[4].id, amount: 50, reason: 'Push notification feature', category: 'BOT_FEATURE' } }),

    prisma.xpLedger.create({ data: { userId: users[6].id, amount: 100, reason: 'Set up CI/CD pipeline', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[6].id, amount: 100, reason: 'Deployed staging env', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[6].id, amount: 100, reason: 'Production deployment', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[6].id, amount: 50, reason: 'Monitoring bot', category: 'BOT_FEATURE' } }),
    prisma.xpLedger.create({ data: { userId: users[6].id, amount: 30, reason: 'Infrastructure review', category: 'CODE_REVIEW' } }),

    prisma.xpLedger.create({ data: { userId: users[7].id, amount: 25, reason: 'Tested dental clinic', category: 'CODE_REVIEW' } }),
    prisma.xpLedger.create({ data: { userId: users[7].id, amount: 25, reason: 'Tested language school', category: 'CODE_REVIEW' } }),
    prisma.xpLedger.create({ data: { userId: users[7].id, amount: 25, reason: 'Tested auto service', category: 'CODE_REVIEW' } }),
    prisma.xpLedger.create({ data: { userId: users[7].id, amount: 15, reason: 'Bug reporting bonus', category: 'BONUS' } }),

    prisma.xpLedger.create({ data: { userId: users[8].id, amount: 100, reason: 'Deployed practice project', category: 'WEBSITE_DEPLOY' } }),
    prisma.xpLedger.create({ data: { userId: users[8].id, amount: 50, reason: 'Chat bot prototype', category: 'BOT_FEATURE' } }),
    prisma.xpLedger.create({ data: { userId: users[8].id, amount: 25, reason: 'Peer code review', category: 'CODE_REVIEW' } }),

    prisma.xpLedger.create({ data: { userId: users[9].id, amount: 25, reason: 'First code review', category: 'CODE_REVIEW' } }),
    prisma.xpLedger.create({ data: { userId: users[9].id, amount: 25, reason: 'Second code review', category: 'CODE_REVIEW' } }),
  ])

  console.log('✅ Created XP ledger entries')

  console.log('🎉 Seeding complete!')
  console.log('')
  console.log('Demo accounts (all passwords: password123):')
  console.log('  📧 admin@apex.uz    (ADMIN, 1000 XP)')
  console.log('  📧 founder@apex.uz  (ADMIN, 1000 XP)')
  console.log('  📧 sardor@apex.uz   (Gold Lead, 1250 XP)')
  console.log('  📧 malika@apex.uz   (Gold Lead, 780 XP)')
  console.log('  📧 aziz@apex.uz     (Silver, 420 XP)')
  console.log('  📧 demo@apex.uz     (Bronze, 50 XP)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
