import { component$ } from '@builder.io/qwik'

export default component$(() => {
	return (
		<>
			<h1 class="text-4xl font-black">New Project</h1>

			<section class="mt-10 flex justify-center">
				<form class="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow">
					<div class="mb-5">
						<label
							for="name"
							class="text-gray-700 upper
        text-sm font-bold">
							Nombre del proyecto
						</label>
						<input
							type="text"
							id="name"
							class="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
							placeholder="Nombre del pryecto"
							name="name"
						/>
					</div>

					<div class="mb-5">
						<label
							for="description"
							class="text-gray-700 upper
        text-sm font-bold">
							Nombre del proyecto
						</label>
						<textarea
							id="description"
							class="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
							placeholder="descripcion del pryecto"
							name="description"
						/>
					</div>
					<div class="mb-5">
						<label
							for="due-date"
							class="text-gray-700 upper
        text-sm font-bold">
							Fecha de entrega
						</label>
						<input
							type="date"
							id="due-date"
							class="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
							placeholder="Nombre del pryecto"
							name="dueDate"
						/>
					</div>

					<div class="mb-5">
						<label
							for="customer"
							class="text-gray-700 upper
        text-sm font-bold">
							Nombre del cliente
						</label>
						<input
							type="text"
							id="customer"
							class="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
							placeholder="Nombre del pryecto"
							name="customer"
						/>
					</div>

					<button
						type="submit"
						class="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded hover:bg-sky-700 transition-colors">
						Crear proyecto
					</button>
				</form>
			</section>
		</>
	)
})
