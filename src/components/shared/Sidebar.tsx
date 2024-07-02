import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { useUserDataLoader } from '~/routes/(authed)/layout';
import { Button } from '../ui/button/button';

type Props = {};

export const Sidebar = component$<Props>(() => {
  const userDataLoader = useUserDataLoader();
  return (
    <aside class="md:w-80 lg:w-96 px-5 py-10 space-y-2">
      <p class="text-xl font-bold">Hola: {userDataLoader.value.user?.name}</p>

      <Link href="/projects/new-project" class="block">
        <Button class="w-full text-md uppercase font-bold">
          Nuevo proyecto
        </Button>
      </Link>
    </aside>
  );
});
