import { component$, Slot } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

export const useServerTimeLoader = routeLoader$(({ request }) => {
	console.log(request)

	return {
		date: new Date().toISOString(),
	}
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
