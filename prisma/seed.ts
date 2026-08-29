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
        email: "shaxzoda_3@apex.uz",
        passwordHash,
        fullName: "Shaxzoda Yusupova",
        region: "BUKHARA",
        role: "PM",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Project Management No experience/coursera certificate",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "ibrohimov_4@apex.uz",
        passwordHash,
        fullName: "Ibrohimov Farrux",
        region: "FERGANA",
        role: "BACKEND",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Frontend developer Backend(+-) Intermediate",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "safron_5@apex.uz",
        passwordHash,
        fullName: "Safron Raxmonkulov",
        region: "NAMANGAN",
        role: "CYBERSECURITY",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Direction: cybersecury, data analysis and Creator. No experience yet🎬",
        techStack: JSON.stringify(['Cybersecurity']),
      }
    }),
    prisma.user.create({
      data: {
        email: "samandar_6@apex.uz",
        passwordHash,
        fullName: "Samandar",
        region: "JIZZAKH",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Backend Frontend (with AI) Intermediate",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "javohir_7@apex.uz",
        passwordHash,
        fullName: "Javohir Rustamjonov",
        region: "KHOREZM",
        role: "FULLSTACK",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Full-Stack Developer Beginner",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "mirafzal_8@apex.uz",
        passwordHash,
        fullName: "Mirafzal Rustamjonov",
        region: "NAVOIY",
        role: "CYBERSECURITY",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Backend dev/ Cybersecurity Intermediate",
        techStack: JSON.stringify(['Cybersecurity']),
      }
    }),
    prisma.user.create({
      data: {
        email: "elbek_9@apex.uz",
        passwordHash,
        fullName: "Elbek Aliyev",
        region: "KASHKADARYA",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Backend Frontend (AI) Intermediate",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "abdulloh_10@apex.uz",
        passwordHash,
        fullName: "Abdulloh",
        region: "TASHKENT",
        role: "BACKEND",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Backend developer(Django, DRF) Intermediate",
        techStack: JSON.stringify(['Django', 'Django Rest Framework']),
      }
    }),
    prisma.user.create({
      data: {
        email: "akbarov_11@apex.uz",
        passwordHash,
        fullName: "Akbarov Diyorbek",
        region: "ANDIJAN",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "AI/ML no experience, Beginner",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "azimboyev_12@apex.uz",
        passwordHash,
        fullName: "Azimboyev Faxriyor",
        region: "SAMARKAND",
        role: "BACKEND",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Backend & vibe coder(recently tried) Intermediate",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "muhammadqodir_13@apex.uz",
        passwordHash,
        fullName: "Muhammadqodir Turobov",
        region: "BUKHARA",
        role: "PM",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Mobile development No experience Learning DSA so i don't know how to build apps yet",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "roxmatullox_14@apex.uz",
        passwordHash,
        fullName: "Roxmatullox Shirinov",
        region: "FERGANA",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Frontend Dev ML Engineer Intermediate",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "obidov_15@apex.uz",
        passwordHash,
        fullName: "Obidov Nabijon",
        region: "NAMANGAN",
        role: "CYBERSECURITY",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Frontend, Cybersecurity Intermediate, Beginner",
        techStack: JSON.stringify(['Cybersecurity']),
      }
    }),
    prisma.user.create({
      data: {
        email: "abdumajidov_16@apex.uz",
        passwordHash,
        fullName: "Abdumajidov Sardor",
        region: "JIZZAKH",
        role: "CYBERSECURITY",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Frontend dev (beginner) Cybersecurity red teamer (beginner)",
        techStack: JSON.stringify(['Cybersecurity']),
      }
    }),
    prisma.user.create({
      data: {
        email: "behruz_17@apex.uz",
        passwordHash,
        fullName: "Behruz O'ktamboyev",
        region: "KHOREZM",
        role: "PM",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Frontend( also vibe-coder ) /Video Editor/Content Creator(in youtube, podcasts), Project manager Beginner/Intermediate(over year of experience) /Inter",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "baxodirov_18@apex.uz",
        passwordHash,
        fullName: "Baxodirov Muhammadamin",
        region: "NAVOIY",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Backend develop+ learning frontend too(with AI). have some experience creating sites Intermediate",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "akbar_20@apex.uz",
        passwordHash,
        fullName: "Akbar Mamayusupov",
        region: "TASHKENT",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Backend (Beginner) Frontend (AI)(Intermediate)",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "nodira_21@apex.uz",
        passwordHash,
        fullName: "Nodira Qodirova",
        region: "ANDIJAN",
        role: "BACKEND",
        tier: "BRONZE",
        totalXp: 50,
        bio: "backend developer beginner",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "soginchbek_22@apex.uz",
        passwordHash,
        fullName: "Sog'inchbek",
        region: "SAMARKAND",
        role: "PM",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Project manager , beginner / I work with ai , one of them on bio and I wanna learn video/motion design, also one of my goals is learning coding.",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "xamidov_24@apex.uz",
        passwordHash,
        fullName: "Xamidov Abdulaziz",
        region: "FERGANA",
        role: "CYBERSECURITY",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Software engineer, cybersecurity (red team) No experience",
        techStack: JSON.stringify(['Cybersecurity']),
      }
    }),
    prisma.user.create({
      data: {
        email: "ozodov_27@apex.uz",
        passwordHash,
        fullName: "Ozodov NurAziz",
        region: "KHOREZM",
        role: "DESIGNER",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Cyber Security (red team) / Graphic Designer Beginner / Intermediate ( + OSINT knowledge )",
        techStack: JSON.stringify(['Cybersecurity']),
      }
    }),
    prisma.user.create({
      data: {
        email: "davron_28@apex.uz",
        passwordHash,
        fullName: "Davron Yuldashbaev",
        region: "NAVOIY",
        role: "MOBILE",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Direction: Flutter Experience level: No experience yet )",
        techStack: JSON.stringify(['Flutter']),
      }
    }),
    prisma.user.create({
      data: {
        email: "abdullayev_31@apex.uz",
        passwordHash,
        fullName: "Abdullayev Akobir",
        region: "ANDIJAN",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Full-Stack Developer  AIML Engineer Intermediate",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "siddiqjonov_32@apex.uz",
        passwordHash,
        fullName: "Siddiqjonov Suhrobbek",
        region: "SAMARKAND",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Backend developer AI engineer (intern)",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "komron_33@apex.uz",
        passwordHash,
        fullName: "Komron",
        region: "BUKHARA",
        role: "DESIGNER",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Designer, sales, business analytics, marketing Lower intermediate",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "shohjahon_34@apex.uz",
        passwordHash,
        fullName: "Shohjahon",
        region: "FERGANA",
        role: "DATA_ANALYST",
        tier: "BRONZE",
        totalXp: 50,
        bio: "-Data/Business analysis -No experience",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "muhammad_35@apex.uz",
        passwordHash,
        fullName: "Muhammad Fazliddin Samadov",
        region: "NAMANGAN",
        role: "DESIGNER",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Figma Ui/UX designer(intermediate) Cybersec student(beginner/no exp at real projects) Frontend experience (middle)",
        techStack: JSON.stringify(['Figma', 'Cybersecurity']),
      }
    }),
    prisma.user.create({
      data: {
        email: "valiyev_36@apex.uz",
        passwordHash,
        fullName: "Valiyev Jasurbek",
        region: "JIZZAKH",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Ai engineer No experience",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "yarasheva_37@apex.uz",
        passwordHash,
        fullName: "Yarasheva Rayhona",
        region: "KHOREZM",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Backend and Frontend (AI)  (Intermediate), content creator (Beginner) , Mobile Developer( No experience at Projects)",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "ezoza_40@apex.uz",
        passwordHash,
        fullName: "Ezoza Zaxidova",
        region: "TASHKENT",
        role: "FRONTEND",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Frontend Developer No experience",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "islombek_41@apex.uz",
        passwordHash,
        fullName: "Islombek Abdumutalibov",
        region: "ANDIJAN",
        role: "DESIGNER",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Frontend Developer (Intermediate), UI/UX Designer (Beginner), Data Analyst (Advanced), Business Analyst (Advanced), Marketing (Advanced)",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "hasanxon_42@apex.uz",
        passwordHash,
        fullName: "Hasanxon Savriddinov",
        region: "SAMARKAND",
        role: "CYBERSECURITY",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Backend(.NET), Cybersecurity Specialist(Red Team) Experience: Intermediate",
        techStack: JSON.stringify(['Cybersecurity']),
      }
    }),
    prisma.user.create({
      data: {
        email: "full_47@apex.uz",
        passwordHash,
        fullName: "Full  Abadov Faridun",
        region: "KHOREZM",
        role: "PM",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Direction: Project manager, Business Analyst, Marketing, Sales, Client Outreach Experience level: advanced",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "shohruh_48@apex.uz",
        passwordHash,
        fullName: "Shohruh O'sarov",
        region: "NAVOIY",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Ai engineering Video editor No  experience",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "akmalnorkulovv_49@apex.uz",
        passwordHash,
        fullName: "akmal_norkulovv",
        region: "KASHKADARYA",
        role: "FRONTEND",
        tier: "BRONZE",
        totalXp: 50,
        bio: "@Iradaa10 @diyorakkk @Bagaysay @sheght You sent your direction and experience level, but the surname is still missing. To avoid mixing up people with ",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "umarov_50@apex.uz",
        passwordHash,
        fullName: "Umarov Abdulloh",
        region: "TASHKENT",
        role: "BACKEND",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Backend developer(Django, DRF) Intermediate",
        techStack: JSON.stringify(['Django', 'Django Rest Framework']),
      }
    }),
    prisma.user.create({
      data: {
        email: "rahim_51@apex.uz",
        passwordHash,
        fullName: "Rahim Rakhimov",
        region: "ANDIJAN",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "AI/ML engineer Experience: Beginner",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "goyibnazarov_52@apex.uz",
        passwordHash,
        fullName: "G'oyibnazarov Sohibjon",
        region: "SAMARKAND",
        role: "FRONTEND",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Agriculture and space rocket engineer Experience:done a number of projects",
        techStack: JSON.stringify([]),
      }
    }),
    prisma.user.create({
      data: {
        email: "husniyor_54@apex.uz",
        passwordHash,
        fullName: "Husniyor Azimboyev",
        region: "FERGANA",
        role: "BACKEND",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Back-end developer(Python/Django/Fastapi/Flask) + Some VibeCoding Front-end experience. Experience: Beginner(have bunch of pet-projects and replicas o",
        techStack: JSON.stringify(['Django', 'Python']),
      }
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



  console.log('🎉 Seeding complete!')
  console.log('')
  console.log('Demo accounts (all passwords: password123):')
  console.log('  📧 admin@apex.uz    (ADMIN, 1000 XP)')
  console.log('  📧 founder@apex.uz  (ADMIN, 1000 XP)')

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
