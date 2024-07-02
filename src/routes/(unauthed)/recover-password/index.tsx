import { component$ } from '@builder.io/qwik';
import { type DocumentHead, Link } from '@builder.io/qwik-city';
import { Button } from '~/components/ui/button/button';
import { Input } from '~/components/ui/input/input';

export default component$(() => {
  return (
    <>
      <h1 class="text-primary font-black text-6xl">
        Recupera tu acceso y no pierdas tus{' '}
        <span class="text-slate-700">proyectos</span>
      </h1>
      <form class="mt-10 bg-white shadow rounded-lg p-10 space-y-4">
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

        <Button type="submit" class="w-full uppercase text-md font-bold">
          Enviar instrucciones
        </Button>
      </form>
      <nav class="lg:flex lg:justify-between">
        <Link href="/">
          <Button look="link" class="uppercase text-sm">
            ¿Ya tienes una cuenta? Inicia sesión
          </Button>
        </Link>

        <Link href="/signup">
          <Button look="link" class="uppercase text-sm">
            ¿No tienes una cuenta? Regístrate
          </Button>
        </Link>
      </nav>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Recupera tu contraseña',
  meta: [
    {
      name: 'description',
      content: 'Recupera tu contraseña y no pierdas tus proyectos',
    },
  ],
};
