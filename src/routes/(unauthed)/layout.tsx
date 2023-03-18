import { component$, Slot } from '@builder.io/qwik'
import { getSessionData } from '@builder.io/qwik-auth'
import { routeLoader$ } from '@builder.io/qwik-city'

export const useLoaderData = routeLoader$(async ({ request, redirect, env }) => {
	const session = await getSessionData(request, {
		secret: env.get('QWIK_AUTH_SECRET'),
		providers: [],
	})
	console.log('🚀 ~ file: index.tsx ~ line 20 ~ useLoaderData ~ session')

	if (!session) {
		throw redirect(303, '/login')
	}
	throw redirect(303, '/projects')
})

export default component$(() => {
	return (
		<main class="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center ">
			<section class="md:w-2/3 lg:w-2/5">
				<Slot />
			</section>
		</main>
	)
})
