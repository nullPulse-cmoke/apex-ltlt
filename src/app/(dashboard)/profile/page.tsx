import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'

export const metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) redirect('/login')

  return (
    <div className="max-w-3xl mx-auto">
      <ProfileForm
        user={{
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          telegramHandle: user.telegramHandle,
          region: user.region,
          role: user.role,
          tier: user.tier,
          totalXp: user.totalXp,
          avatarUrl: user.avatarUrl,
          bio: user.bio,
          techStack: user.techStack,
          githubUrl: user.githubUrl,
          linkedinUrl: user.linkedinUrl,
          portfolioUrl: user.portfolioUrl,
        }}
      />
    </div>
  )
}
