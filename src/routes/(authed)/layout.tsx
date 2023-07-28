import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Header } from '~/components/ui/Header';
import { Sidebar } from '~/components/ui/Sidebar';
import { auth } from '~/lib/lucia';
import { prisma } from '~/lib/prisma';

export const useUserDataLoader = routeLoader$(async (event) => {
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();

  if (!session) {
    throw event.redirect(303, '/');
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.userId,
    },
  });

  return {
    user,
  };
});

// export const useSignoutAction = routeAction$(async (values, event) => {
//   const authRequest = auth.handleRequest(event);
//   const { session } = await authRequest.validateUser();

//   if (!session) throw event.redirect(303, '/');

//   auth.invalidateSession(session.sessionId);
//   authRequest.setSession(null);

//   throw event.redirect(303, '/');
// });

export default component$(() => {
  return (
    <>
      <section>
        <Header />
        <div class="md:flex md:min-h-screen">
          <Sidebar />
          <main class="flex-1 p-10">
            <Slot />
          </main>
        </div>
      </section>
    </>
  );
});
