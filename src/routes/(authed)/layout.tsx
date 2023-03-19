import { component$, Slot } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'
import { Header } from '~/components/ui/Header'
import { Sidebar } from '~/components/ui/Sidebar'
import { getUserData } from '~/utils/session'

export const useLoaderUserData = routeLoader$(async ({ request, env, redirect }) => {
	const user = await getUserData(request, env)

	if (!user) {
		throw redirect(303, '/')
	}

	return {
		name: user.name,
	}
})

export default component$(() => {
	const userData = useLoaderUserData()
	return (
		<>
			<section>
				<Header />
				<div class="md:flex md:min-h-screen">
					<Sidebar userData={userData.value} />
					<main class="flex-1 p-10">
						<Slot />
					</main>
				</div>
			</section>
		</>
	)
})
