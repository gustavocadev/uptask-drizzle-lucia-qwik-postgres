import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Header } from '~/components/ui/Header';
import { Sidebar } from '~/components/ui/Sidebar';
import { auth } from '~/lib/lucia';

export const useUserDataLoader = routeLoader$(async (event) => {
  const authRequest = auth.handleRequest(event);
  const { user } = await authRequest.validateUser();

  if (!user) {
    throw event.redirect(303, '/');
  }

  return {
    name: user.name,
  };
});

export default component$(() => {
  const userData = useUserDataLoader();
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
  );
});
