import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

export const Sidebar = component$(() => {
	return (
		<aside class="md:w-80 lg:w-96 px-5 py-10">
			<p class="text-xl font-bold">Hola: {'?_name'}</p>

			<Link
				href="new-project"
				class="bg-sky-600 w-full text-white uppercase p-3 font-bold block mt-5 text-center rounded-lg">
				Nuevo proyecto
			</Link>
		</aside>
	)
})
