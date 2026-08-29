import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.notification.deleteMany()
  await prisma.xpLedger.deleteMany()
  await prisma.application.deleteMany()
  await prisma.program.deleteMany()
  await prisma.user.deleteMany()

  // Admin password
  const adminHash = await bcrypt.hash('password123', 12)

  // Volunteer passwords
  const volPasswords = await Promise.all([
    bcrypt.hash('nvjv23', 12),
    bcrypt.hash('vghc01', 12),
    bcrypt.hash('rzge39', 12),
    bcrypt.hash('lorw33', 12),
    bcrypt.hash('jtwc25', 12),
    bcrypt.hash('yjsz80', 12),
    bcrypt.hash('tuoc02', 12),
    bcrypt.hash('lfjm50', 12),
    bcrypt.hash('xagm79', 12),
    bcrypt.hash('gihe51', 12),
    bcrypt.hash('reuv67', 12),
    bcrypt.hash('iayv94', 12),
    bcrypt.hash('lyhk11', 12),
    bcrypt.hash('autc47', 12),
    bcrypt.hash('gwtd77', 12),
    bcrypt.hash('stfh07', 12),
    bcrypt.hash('jngl51', 12),
    bcrypt.hash('xhlx81', 12),
    bcrypt.hash('jkyn68', 12),
    bcrypt.hash('hwwy62', 12),
    bcrypt.hash('jakj66', 12),
    bcrypt.hash('swlj59', 12),
    bcrypt.hash('dutr80', 12),
    bcrypt.hash('ukcf62', 12),
    bcrypt.hash('uxqg38', 12),
    bcrypt.hash('gigr22', 12),
    bcrypt.hash('gzbh24', 12),
    bcrypt.hash('efbp51', 12),
    bcrypt.hash('hmbc97', 12),
    bcrypt.hash('erxq60', 12),
    bcrypt.hash('tikw28', 12),
    bcrypt.hash('tvgs12', 12),
    bcrypt.hash('gaji95', 12),
    bcrypt.hash('bbfq08', 12),
    bcrypt.hash('vquz00', 12),
    bcrypt.hash('cgbl88', 12),
    bcrypt.hash('zlad29', 12),
    bcrypt.hash('niuj88', 12),
    bcrypt.hash('ctug63', 12),
    bcrypt.hash('kpxm47', 12),
  ])

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@apex.uz',
        passwordHash: adminHash,
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
        passwordHash: adminHash,
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
        email: "shaxzoda1",
        passwordHash: volPasswords[0],
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
        email: "ibrohimov2",
        passwordHash: volPasswords[1],
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
        email: "safron3",
        passwordHash: volPasswords[2],
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
        email: "samandar4",
        passwordHash: volPasswords[3],
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
        email: "javohir5",
        passwordHash: volPasswords[4],
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
        email: "mirafzal6",
        passwordHash: volPasswords[5],
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
        email: "elbek7",
        passwordHash: volPasswords[6],
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
        email: "abdulloh8",
        passwordHash: volPasswords[7],
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
        email: "akbarov9",
        passwordHash: volPasswords[8],
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
        email: "azimboyev10",
        passwordHash: volPasswords[9],
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
        email: "muhammadqodir11",
        passwordHash: volPasswords[10],
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
        email: "roxmatullox12",
        passwordHash: volPasswords[11],
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
        email: "obidov13",
        passwordHash: volPasswords[12],
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
        email: "abdumajidov14",
        passwordHash: volPasswords[13],
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
        email: "behruz15",
        passwordHash: volPasswords[14],
        fullName: "Bekhruz Tadjiev",
        region: "KHOREZM",
        role: "AI_ML",
        tier: "BRONZE",
        totalXp: 50,
        bio: "AI/ML Engineer, Data Analyst. Experience level: Intermediate.",
        techStack: JSON.stringify(['AI_ML', 'Data Analysis']),
      }
    }),
    prisma.user.create({
      data: {
        email: "baxodirov16",
        passwordHash: volPasswords[15],
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
        email: "akbar17",
        passwordHash: volPasswords[16],
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
        email: "nodira18",
        passwordHash: volPasswords[17],
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
        email: "soginchbek19",
        passwordHash: volPasswords[18],
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
        email: "xamidov20",
        passwordHash: volPasswords[19],
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
        email: "ozodov21",
        passwordHash: volPasswords[20],
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
        email: "davron22",
        passwordHash: volPasswords[21],
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
        email: "abdullayev23",
        passwordHash: volPasswords[22],
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
        email: "siddiqjonov24",
        passwordHash: volPasswords[23],
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
        email: "komron25",
        passwordHash: volPasswords[24],
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
        email: "shohjahon26",
        passwordHash: volPasswords[25],
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
        email: "muhammad27",
        passwordHash: volPasswords[26],
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
        email: "valiyev28",
        passwordHash: volPasswords[27],
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
        email: "yarasheva29",
        passwordHash: volPasswords[28],
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
        email: "ezoza30",
        passwordHash: volPasswords[29],
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
        email: "islombek31",
        passwordHash: volPasswords[30],
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
        email: "hasanxon32",
        passwordHash: volPasswords[31],
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
        email: "full33",
        passwordHash: volPasswords[32],
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
        email: "shohruh34",
        passwordHash: volPasswords[33],
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
        email: "akmalnorkulovv35",
        passwordHash: volPasswords[34],
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
        email: "umarov36",
        passwordHash: volPasswords[35],
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
        email: "rahim37",
        passwordHash: volPasswords[36],
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
        email: "goyibnazarov38",
        passwordHash: volPasswords[37],
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
        email: "husniyor39",
        passwordHash: volPasswords[38],
        fullName: "Husniyor Azimboyev",
        region: "FERGANA",
        role: "BACKEND",
        tier: "BRONZE",
        totalXp: 50,
        bio: "Back-end developer(Python/Django/Fastapi/Flask) + Some VibeCoding Front-end experience. Experience: Beginner(have bunch of pet-projects and replicas o",
        techStack: JSON.stringify(['Django', 'Python']),
      }
    }),
    prisma.user.create({
      data: {
        email: "sarvarbek40",
        passwordHash: volPasswords[39],
        fullName: "Tursunaliev Sarvarbek",
        region: "TASHKENT",
        role: "CYBERSECURITY",
        tier: "BRONZE",
        totalXp: 50,
        bio: "AI, Frontend, Cyber security. Experience level: Beginner",
        techStack: JSON.stringify(['Cybersecurity']),
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
  console.log('Admin accounts (password: password123):')
  console.log('  📧 admin@apex.uz    (ADMIN)')
  console.log('  📧 founder@apex.uz  (ADMIN)')
  console.log('')
  console.log('📋 39 volunteers created with unique credentials')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
