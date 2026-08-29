export const REGIONS = [
  { value: 'TASHKENT', label: 'Tashkent' },
  { value: 'SAMARKAND', label: 'Samarkand' },
  { value: 'BUKHARA', label: 'Bukhara' },
  { value: 'FERGANA', label: 'Fergana' },
  { value: 'ANDIJAN', label: 'Andijan' },
  { value: 'NAMANGAN', label: 'Namangan' },
  { value: 'KASHKADARYA', label: 'Kashkadarya' },
  { value: 'SURKHANDARYA', label: 'Surkhandarya' },
  { value: 'JIZZAKH', label: 'Jizzakh' },
  { value: 'SYRDARYA', label: 'Syrdarya' },
  { value: 'KHOREZM', label: 'Khorezm' },
  { value: 'NAVOI', label: 'Navoi' },
  { value: 'KARAKALPAKSTAN', label: 'Karakalpakstan' },
] as const

export const ROLES = [
  { value: 'FRONTEND', label: 'Frontend Developer' },
  { value: 'BACKEND', label: 'Backend Developer' },
  { value: 'FULLSTACK', label: 'Full-Stack Developer' },
  { value: 'DESIGNER', label: 'UI/UX Designer' },
  { value: 'MOBILE', label: 'Mobile Developer' },
  { value: 'DEVOPS', label: 'DevOps / Cloud Engineer' },
  { value: 'PM', label: 'Project Manager' },
  { value: 'QA', label: 'QA / Tester' },
  { value: 'AI_ML', label: 'AI/ML Engineer' },
  { value: 'DATA_ANALYST', label: 'Data Analyst' },
  { value: 'CYBERSECURITY', label: 'Cybersecurity Specialist' },
  { value: 'MARKETING', label: 'Marketing Specialist' },
] as const

export const XP_RULES = [
  { category: 'WEBSITE_DEPLOY', label: 'Website Deployed', xp: 100, icon: '🌐' },
  { category: 'API_INTEGRATION', label: 'API Integration Completed', xp: 75, icon: '🔌' },
  { category: 'DESIGN_SYSTEM', label: 'UI Component / Design System', xp: 60, icon: '🎨' },
  { category: 'BOT_FEATURE', label: 'Telegram Bot Feature', xp: 50, icon: '🤖' },
  { category: 'DATABASE_WORK', label: 'Database Schema / Optimization', xp: 50, icon: '💾' },
  { category: 'CICD_PIPELINE', label: 'CI/CD Pipeline Setup', xp: 45, icon: '🚀' },
  { category: 'BUG_FIX', label: 'Bug Fixed', xp: 30, icon: '🐛' },
  { category: 'CODE_REVIEW', label: 'Code Review Approved', xp: 25, icon: '🔍' },
  { category: 'DOCUMENTATION', label: 'Technical Documentation', xp: 20, icon: '📝' },
  { category: 'BONUS', label: 'Founder Bonus', xp: 50, icon: '⭐' },
] as const

export const TIER_THRESHOLDS = [
  { tier: 'BRONZE', label: 'Bronze', minXp: 0, icon: '🥉' },
  { tier: 'SILVER', label: 'Silver', minXp: 200, icon: '🥈' },
  { tier: 'GOLD_LEAD', label: 'Gold Lead', minXp: 500, icon: '🥇' },
] as const

export const CLIENT_TYPES = [
  { value: 'RESTAURANT', label: 'Restaurant / Cafe' },
  { value: 'CLINIC', label: 'Clinic / Healthcare' },
  { value: 'RETAIL', label: 'Retail / Shop' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'SERVICES', label: 'Services' },
  { value: 'OTHER', label: 'Other' },
] as const

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Programs', href: '/programs', icon: 'FolderKanban' },
  { label: 'Applications', href: '/applications', icon: 'FileText' },
  { label: 'Leaderboard', href: '/leaderboard', icon: 'Trophy' },
  { label: 'Profile', href: '/profile', icon: 'UserCircle' },
] as const
