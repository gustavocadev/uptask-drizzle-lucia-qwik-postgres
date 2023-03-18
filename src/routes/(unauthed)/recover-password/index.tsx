import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'

export default component$(() => {
	return (
		<>
			<h1 class="text-sky-600 font-black text-6xl">
				Recupera tu acceso y no pierdas tus <span class="text-slate-700">proyectos</span>
			</h1>
			<form class="mt-10 bg-white shadow rounded-lg p-10">
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

				<button
					type="submit"
					class="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded cursor-pointer hover:bg-sky-800 transition-colors mt-5">
					Enviar instrucciones
				</button>
			</form>
			<nav class="lg:flex lg:justify-between">
				<Link href="/" class="block text-center my-5 text-slate-500 uppercase text-sm">
					¿Ya tienes una cuenta? Inicia sesión
				</Link>

				<Link href="/signup" class="block text-center my-5 text-slate-500 uppercase text-sm">
					¿No tienes una cuenta? Regístrate
				</Link>
			</nav>
		</>
	)
})
