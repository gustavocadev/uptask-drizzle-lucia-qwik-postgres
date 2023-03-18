import { component$ } from '@builder.io/qwik'
import { type DocumentHead, routeLoader$, routeAction$, zod$, z, Form } from '@builder.io/qwik-city'

interface ListItem {
	text: string
}

const list: ListItem[] = []

export const useListLoader = routeLoader$(() => {
	return list
})

export const useAddToListAction = routeAction$(
	(item) => {
		list.push(item)
		return {
			success: true,
		}
	},
	zod$({
		text: z.string(),
	})
)

export default component$(() => {
	const list = useListLoader()
	const action = useAddToListAction()

	return (
		<>
			<header class="text-3xl text-center">
				<h1>TODO List</h1>
			</header>

			<Form action={action} spaReset class="flex flex-col max-w-sm mx-auto gap-2">
				<input type="text" name="text" required class="p-2 rounded border" />
				<button type="submit" class="px-2 py-2 bg-sky-600 rounded text-white">
					Add item
				</button>
			</Form>

			<div class="flex flex-col max-w-sm mx-auto gap-2">
				{(list.value.length && (
					<ul>
						{list.value.map((item, index) => (
							<li key={`items-${index}`}>{item.text}</li>
						))}
					</ul>
				)) || <span class="text-center">No items found</span>}
			</div>
		</>
	)
})

export const head: DocumentHead = {
	title: 'QwikCity Todo List',
	meta: [
		{
			name: 'description',
			content: 'Qwik Todo List',
		},
	],
}
