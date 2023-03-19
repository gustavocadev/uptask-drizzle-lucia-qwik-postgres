import { component$, Slot } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import { getUserData } from '../../utils/session'

export const useLoaderData = routeLoader$(async ({ request, env, redirect }) => {
	const session = await getUserData(request, env)
	// if (!session) {
	// 	console.log('There is no session')
	// 	throw redirect(303, '/api/auth/signin')
	// }
	// console.log('There is a session')
	if (session) throw redirect(303, '/projects')
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
