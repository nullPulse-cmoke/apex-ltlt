import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) return null

        // Update lastLoginAt on successful login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.avatarUrl,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      // Refresh user data from DB
      if (token.id) {
        let dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        })
        
        // Healing session if database was reset or reseeded
        if (!dbUser && token.email) {
          dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
          })
          if (dbUser) {
            token.id = dbUser.id
          }
        }

        if (dbUser) {
          token.role = dbUser.role
          token.tier = dbUser.tier
          token.totalXp = dbUser.totalXp
          token.fullName = dbUser.fullName
          token.avatarUrl = dbUser.avatarUrl
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as unknown as Record<string, unknown>
        u.id = token.id as string
        u.role = token.role
        u.tier = token.tier
        u.totalXp = token.totalXp
        u.fullName = token.fullName
        u.avatarUrl = token.avatarUrl
      }
      return session
    },
  },
})
