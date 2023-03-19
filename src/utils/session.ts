import { getSessionData } from '@builder.io/qwik-auth'
import { prisma } from '~/server/prisma'

type Env = {
	get: (key: string) => string | undefined
}

export const getUserData = async (req: Request, env: Env) => {
	const session = await getSessionData(req, {
		secret: env.get('QWIK_AUTH_SECRET') ?? '',
		providers: [],
	})

	const user = prisma.user.findFirst({
		where: {
			email: session?.user?.email ?? '',
		},
	})

	return user
}
