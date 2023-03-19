import { component$ } from '@builder.io/qwik'
import { Form, Link } from '@builder.io/qwik-city'
import { useAuthSignout } from '~/routes/plugin@auth'

export const Header = component$(() => {
	const actionSignout = useAuthSignout()
	return (
		<header class="px-4 py-5 bg-white border-b">
			<nav class="md:flex md:justify-between">
				<h2 class="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">
					<Link href="/projects">Uptasks</Link>
				</h2>

				<div class="flex flex-col md:flex-row items-center gap-4">
					<Form spaReset>
						<input
							type="input"
							class="border border-gray-300 p-3 rounded-md"
							placeholder="Buscar"
							name="search"
						/>
					</Form>
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
					{/* <Busqueda /> */}
				</div>
			</nav>
		</header>
	)
})
