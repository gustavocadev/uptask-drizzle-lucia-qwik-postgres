import { component$ } from '@builder.io/qwik';
import { routeAction$, Form, Link, zod$, z } from '@builder.io/qwik-city';
import { auth } from '~/lib/lucia';

export const useSignupAction = routeAction$(
  async (values, event) => {
    // create the user in the database
    await auth.createUser({
      key: {
        providerId: 'email',
        providerUserId: values.email,
        password: values.password,
      },
      attributes: {
        name: values.name,
        email: values.email,
        token: crypto.randomUUID(),
      },
    });
    // redirect to login page
    throw event.redirect(303, '/');
  },
  zod$({
    name: z.string().min(3).max(25),
    email: z.string().email(),
    password: z.string().min(5).max(20),
    password2: z.string().min(5).max(20),
  })
);

export default component$(() => {
  const signupAction = useSignupAction();
  return (
    <>
      <h1 class="text-sky-600 font-black text-6xl">
        Crea tu cuenta y administra tus{' '}
        <span class="text-slate-700">proyectos</span>
      </h1>
      <Form action={signupAction} class="mt-10 bg-white shadow rounded-lg p-10">
        <div>
          <label
            class="uppercase text-gray-600 block text-xl font-bold"
            for="name"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name de registro"
            class="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <div>
          <label
            class="uppercase text-gray-600 block text-xl font-bold"
            for="email"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email de registro"
            class="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <div class="mt-5">
          <label
            class="uppercase text-gray-600 block text-xl font-bold"
            for="password"
          >
            Password
          </label>
          <input
            type="text"
            id="password"
            name="password"
            placeholder="Password de registro"
            class="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <div class="mt-5">
          <label
            class="uppercase text-gray-600 block text-xl font-bold"
            for="password2"
          >
            Repetir Password
          </label>
          <input
            type="text"
            id="password2"
            name="password2"
            placeholder="Repetir password"
            class="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <button
          type="submit"
          class="bg-sky-700 w-full py-3 text-white uppercase font-bold rounded cursor-pointer hover:bg-sky-800 transition-colors mt-5"
        >
          Crear cuenta
        </button>
      </Form>
      <nav class="lg:flex lg:justify-between">
        <Link
          href="/"
          preventdefault:reset
          class="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          ¿Ya tienes una cuenta? Inicia sesión
        </Link>

        <Link
          href="/recover-password"
          preventdefault:reset
          class="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </nav>
    </>
  );
});
