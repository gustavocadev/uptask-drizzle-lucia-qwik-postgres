import type { RequestHandler } from '@builder.io/qwik-city'

export const onGet: RequestHandler = async ({ json }) => {
	console.log('🌻 ~ file: index.tsx ~ line 20 ~ useLoaderData ~ session')
	json(303, {
		message: 'Hello World',
	})
}
