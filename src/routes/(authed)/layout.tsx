import { component$, Slot } from '@builder.io/qwik'
import { Header } from '~/components/ui/Header'
import { Sidebar } from '~/components/ui/Sidebar'
import { useAuthSession } from '../plugin@auth'

export default component$(() => {
	const userSignal = useAuthSession()
	return (
		<>
			<section>
				<Header loggedIn={userSignal.value?.user !== undefined} />
				<pre>{JSON.stringify(userSignal.value, null, 2)}</pre>
				<div class="md:flex md:min-h-screen">
					<Sidebar />
					<main class="flex-1 p-10">
						<Slot />
					</main>
				</div>
			</section>
		</>
	)
})
