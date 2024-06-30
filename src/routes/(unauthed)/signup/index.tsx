import { component$ } from '@builder.io/qwik';
import { routeAction$, Form, Link, zod$, z } from '@builder.io/qwik-city';
import { hashPassword } from 'qwik-lucia';
import { db } from '~/server/db/db';
import { userTable } from '~/server/db/schema';
import pg from 'pg';

export const useSignupAction = routeAction$(
  async (values, { redirect, fail }) => {
    try {
      // verify passwords match
      if (values.password !== values.confirmPassword) {
        return fail(400, {
          message: 'Passwords do not match',
        });
      }

      const passwordHash = await hashPassword(values.password);

      console.log({ passwordHash });

      await db.insert(userTable).values({
        name: values.name,
        lastName: values.lastName,
        passwordHash: passwordHash,
        email: values.email,
      });

      console.log('User created');
    } catch (e) {
      console.log(e);
      if (
        e instanceof pg.DatabaseError &&
        e.message === 'AUTH_DUPLICATE_KEY_ID'
      ) {
        return fail(400, {
          message: 'Username already taken',
        });
      }
      return fail(500, {
        message: 'An unknown error occurred',
      });
    }
    // make sure you don't throw inside a try/catch block!
    throw redirect(303, '/login');
  },
  zod$({
    name: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(255),
    confirmPassword: z.string().min(8).max(255),
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
            Nombres
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Nombres"
            class="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          />
        </div>

        <div>
          <label
            class="uppercase text-gray-600 block text-xl font-bold"
            for="lastName"
          >
            Apellidos
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Apellidos"
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
            Contraseña
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
            for="confirmPassword"
          >
            Repetir Contraseña
          </label>
          <input
            type="text"
            id="confirmPassword"
            name="confirmPassword"
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
