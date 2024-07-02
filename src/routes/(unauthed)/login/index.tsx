import { component$ } from '@builder.io/qwik';
import {
  type DocumentHead,
  Link,
  Form,
  routeAction$,
  zod$,
  z,
  useLocation,
} from '@builder.io/qwik-city';
import { Button } from '~/components/ui/button/button';
import { Input } from '~/components/ui/input/input';
import { handleRequest } from '~/server/db/lucia';
import { login } from '~/server/services/auth/auth';

export const useAuthSigninAction = routeAction$(
  async (values, { redirect, fail, cookie }) => {
    // Important! Use `handleRequest` to handle the authentication request
    const authRequest = handleRequest({ cookie });
    const { message, session } = await login(values.email, values.password);

    // if the login fails, return a 400 status code with a message
    if (!session) return fail(400, { message });

    authRequest.setSession(session); // set session cookie

    // make sure you don't throw inside a try/catch block!
    throw redirect(303, '/projects');
  },
  zod$({
    email: z.string(),
    password: z.string(),
  })
);

export default component$(() => {
  // const loginAction = useLoginAction()
  const authSignInAction = useAuthSigninAction();
  const loc = useLocation();

  // useVisibleTask$(() => {
  //   console.log(`${loc.url.origin}/projects`);
  // });

  return (
    <main class="space-y-10">
      <h1 class="text-primary font-black text-6xl">
        Inicia sesion y administra tus{' '}
        <span class="text-slate-700">proyectos</span>
      </h1>
      <div>
        <Form
          action={authSignInAction}
          class="bg-white shadow rounded-sm p-10 space-y-6"
        >
          <div class="space-y-2">
            <label
              class="uppercase text-gray-600 block text-xl font-bold"
              for="email"
            >
              Email
            </label>
            <Input
              type="text"
              id="email"
              placeholder="Email de registro"
              class="w-full bg-gray-50"
              name="email"
            />
          </div>

          <div class="space-y-2">
            <label
              class="uppercase text-gray-600 block text-xl font-bold"
              for="password"
            >
              Password
            </label>
            <Input
              type="text"
              id="password"
              placeholder="Password de registro"
              class="w-full bg-gray-50"
              name="password"
            />
          </div>

          <Button
            type="submit"
            class="w-full text-md uppercase font-bold"
            look="primary"
            disabled={loc.isNavigating}
          >
            Iniciar sesion
          </Button>
        </Form>
        <footer class="lg:flex lg:justify-between">
          <Link href="/signup" preventdefault:reset>
            <Button look="link" class="uppercase text-sm">
              No tienes cuenta? Registrate
            </Button>
          </Link>

          <Link href="/recover-password" preventdefault:reset>
            <Button look="link" class="uppercase text-sm">
              Olvidaste tu password?
            </Button>
          </Link>
        </footer>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: 'Inicia sesion en Mitask',
  meta: [
    {
      name: 'description',
      content: 'Inicia sesion en Mitask y administra tus proyectos',
    },
  ],
};
