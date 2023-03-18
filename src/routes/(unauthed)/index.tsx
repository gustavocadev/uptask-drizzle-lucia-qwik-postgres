import { component$ } from '@builder.io/qwik'
import { type DocumentHead, Link, Form, routeLoader$ } from '@builder.io/qwik-city'
import { useAuthSignin } from '~/routes/plugin@auth'

export const useLoaderData = routeLoader$(({ redirect }) => {
	throw redirect(303, '/api/auth/signin')
})

export const head: DocumentHead = {
	title: 'Welcome to Qwik',
	meta: [
		{
			name: 'description',
			content: 'Qwik site description',
		},
	],
}

// export const useLoginAction = routeAction$(
// 	(values) => {
// 		console.log({ values })

// 		return {
// 			success: true,
// 		}
// 	},
// 	zod$({
// 		email: z.string().email(),
// 		password: z.string(),
// 	})
// )

export default component$(() => {
	// const loginAction = useLoginAction()
	const loginAction = useAuthSignin()
	return (
		<>
			<h1 class="text-sky-600 font-black text-6xl">
				Inicia sesion y administra tus <span class="text-slate-700">proyectos</span>
			</h1>
			<Form action={loginAction} class="mt-10 bg-white shadow rounded-lg p-10">
				<div>
					<label class="uppercase text-gray-600 block text-xl font-bold" for="email">
						Email
					</label>
					<input
						type="text"
						id="email"
						placeholder="Email de registro"
						class="w-full mt-3 p-3 border rounded-xl bg-gray-50"
						name="email"
					/>
				</div>

				<div class="mt-5">
					<label class="uppercase text-gray-600 block text-xl font-bold" for="password">
						Password
					</label>
					<input
						type="text"
						id="password"
						placeholder="Password de registro"
						class="w-full mt-3 p-3 border rounded-xl bg-gray-50"
						name="password"
					/>
				</div>

				<input type="hidden" name="provider" value="credentials" />

				<button
					type="submit"
					class="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded cursor-pointer hover:bg-sky-800 transition-colors mt-5">
					Iniciar sesion
				</button>
			</Form>
			<nav class="lg:flex lg:justify-between">
				<Link
					href="/signup"
					class="block text-center my-5 text-slate-500 uppercase text-sm"
					preventdefault:reset>
					No tienes cuenta? Registrate
				</Link>

				<Link
					href="/recover-password"
					class="block text-center my-5 text-slate-500 uppercase text-sm"
					preventdefault:reset>
					Olvidaste tu password?
				</Link>
			</nav>
		</>
	)
})
