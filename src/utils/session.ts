import { getSessionData } from '@builder.io/qwik-auth'
import { prisma } from '~/server/prisma'

export const getUserSession = async (req: Request, secret: string) => {
	const session = await getSessionData(req, {
		secret,
		providers: [],
	})

	const user = prisma.user.findFirst({
		where: {
			email: session?.user?.email ?? '',
		},
	})

	return user
}
