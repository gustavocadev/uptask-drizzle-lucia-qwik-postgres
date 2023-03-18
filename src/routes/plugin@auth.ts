import { serverAuth$ } from '@builder.io/qwik-auth'
import Credentials from '@auth/core/providers/credentials'
import type { Provider } from '@auth/core/providers'
import { prisma } from '~/server/prisma'
import argon2 from 'argon2'
// env.get('AUTH_SECRET')
export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } = serverAuth$(() => ({
	secret: 'ThisIsASecret',
	trustHost: true,
	providers: [
		Credentials({
			name: 'Login',
			authorize: async (credentials) => {
				// todo: validate credentials with database
				const user = await prisma.user.findFirst({
					where: {
						email: credentials?.email as string,
					},
				})

				console.log({ user })

				const isPasswordValid = await argon2.verify(
					user?.password as string,
					credentials?.password as string
				)

				if (!isPasswordValid) {
					return null
				}

				return user
			},
			credentials: {
				email: {
					label: 'Email',
					type: 'text',
				},
				password: {
					label: 'Password',
					type: 'text',
				},
			},
		}),
	] as Provider[],
	pages: {},
}))
