import { component$ } from '@builder.io/qwik';
import {
  routeAction$,
  Form,
  Link,
  zod$,
  z,
  type DocumentHead,
} from '@builder.io/qwik-city';
import { hashPassword } from 'qwik-lucia';
import { db } from '~/server/db/db';
import { userTable } from '~/server/db/schema';
import pg from 'pg';
import { Button } from '~/components/ui/button/button';
import { Input } from '~/components/ui/input/input';

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
    <main class="space-y-10">
      <h1 class="text-primary font-black text-6xl">
        Crea tu cuenta y administra tus{' '}
        <span class="text-slate-700">proyectos</span>
      </h1>
      <div>
        <Form
          action={signupAction}
          class="bg-white shadow rounded-lg p-10 space-y-6"
        >
          <div class="space-y-2">
            <label
              class="uppercase text-gray-600 block text-xl font-bold"
              for="name"
            >
              Nombres
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Nombres"
              class="w-full bg-gray-50"
            />
          </div>

          <div class="space-y-2">
            <label
              class="uppercase text-gray-600 block text-xl font-bold"
              for="lastName"
            >
              Apellidos
            </label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Apellidos"
              class="w-full bg-gray-50"
            />
          </div>

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
              name="email"
              placeholder="Email de registro"
              class="w-full bg-gray-50"
            />
          </div>

          <div class="space-y-2">
            <label
              class="uppercase text-gray-600 block text-xl font-bold"
              for="password"
            >
              Contraseña
            </label>
            <Input
              type="text"
              id="password"
              name="password"
              placeholder="Password de registro"
              class="w-full bg-gray-50"
            />
          </div>

          <div class="space-y-2">
            <label
              class="uppercase text-gray-600 block text-xl font-bold"
              for="confirmPassword"
            >
              Repetir Contraseña
            </label>
            <Input
              type="text"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Repetir password"
              class="w-full bg-gray-50"
            />
          </div>

          <Button type="submit" class="w-full uppercase text-md font-bold">
            Crear cuenta
          </Button>
        </Form>
        <footer class="lg:flex lg:justify-between">
          <Link href="/" preventdefault:reset>
            <Button look="link" class="uppercase text-sm">
              ¿Ya tienes una cuenta? Inicia sesión
            </Button>
          </Link>

          <Link href="/recover-password" preventdefault:reset>
            <Button look="link" class="uppercase text-sm">
              ¿Olvidaste tu contraseña?
            </Button>
          </Link>
        </footer>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: 'Crea tu cuenta en Mitask',
  meta: [
    {
      name: 'description',
      content: 'Crea tu cuenta en Mitask y administra tus proyectos',
    },
  ],
};
