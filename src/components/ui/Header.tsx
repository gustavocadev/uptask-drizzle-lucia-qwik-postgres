import { component$ } from '@builder.io/qwik'
import { Form, Link } from '@builder.io/qwik-city'
import { useAuthSignout } from '~/routes/plugin@auth'

export const Header = component$(() => {
	const actionSignout = useAuthSignout()
	return (
		<header class="px-4  py-5 bg-white border-b">
			<nav class="md:flex md:justify-between">
				<h2 class="text-4xl text-sky-600 font-black text-center">Uptask</h2>
				<input
					type="search"
					placeholder="Buscar proyecto"
					class="rounded-lg lg:w-96 block p-2 border"
				/>

				<div class="flex items-center gap-4">
					<Link href="/projects" class="font-bold uppercase">
						Proyectos
					</Link>

					<Form action={actionSignout}>
						<button
							type="submit"
							class="
          text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold
          ">
							Cerrar sesion
						</button>
					</Form>
				</div>
			</nav>
		</header>
	)
})
