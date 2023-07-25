import { component$ } from '@builder.io/qwik';
import {
  Form,
  routeLoader$,
  z,
  zod$,
  routeAction$,
} from '@builder.io/qwik-city';
import { prisma } from '~/lib/prisma';

export const useActionSearchUsers = routeAction$(
  async (values) => {
    const user = await prisma.authUser.findUnique({
      where: {
        email: values.email,
      },
    });

    console.log({ user });

    if (!user) {
      return {
        error: 'User not found',
      };
    }

    return {
      user,
    };
  },
  zod$({
    email: z.string().email().trim(),
  })
);

export const useActionAddContributor = routeAction$(
  async (values, request) => {
    console.log({ values });
    const userToAdd = await prisma.authUser.findFirst({
      where: {
        id: values.userId,
      },
    });

    if (!userToAdd) {
      return {
        error: 'User not found',
      };
    }

    await prisma.project.update({
      where: {
        id: values.projectId,
      },
      data: {
        contributors: {
          // connect means that we are adding a user to the project
          connect: {
            id: userToAdd.id,
          },
        },
      },
    });

    console.log({ userToAdd });
    throw request.redirect(303, `/projects/${values.projectId}`);
  },
  zod$({
    userId: z.string(),
    projectId: z.string(),
  })
);

export const useLoaderProject = routeLoader$(async ({ params }) => {
  // the project data
  const project = await prisma.project.findUnique({
    where: {
      id: params.id,
    },
  });

  return {
    project,
  };
});

export default component$(() => {
  const loaderProject = useLoaderProject();
  const actionSearchUsers = useActionSearchUsers();
  const actionAddContributor = useActionAddContributor();
  return (
    <>
      <h1 class="text-4xl font-bold">
        Añadir Colaborador(a) al Proyecto:{' '}
        <span class="font-semibold">{loaderProject.value.project?.name}</span>
      </h1>

      <div class="mt-10 flex justify-center">
        <Form
          class="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow mx-auto"
          action={actionSearchUsers}
        >
          <div class="mb-5">
            <label
              class="text-gray-700 uppercase font-bold text-sm"
              for="email"
            >
              Email Colaborador
            </label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email del Usuario"
              class="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            />
          </div>

          <button
            type="submit"
            class="bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm"
          >
            Buscar Colaborador
          </button>
        </Form>
      </div>

      {actionSearchUsers.value?.user && (
        <div class="flex justify-center mt-10">
          <div class="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">
            <h2 class="text-center mb-10 text-2xl font-bold">Resultado:</h2>

            <Form
              class="flex justify-between items-center"
              action={actionAddContributor}
            >
              <p>{actionSearchUsers.value.user.name ?? ''}</p>
              <input
                type="hidden"
                name="projectId"
                value={loaderProject.value.project?.id}
              />
              <input
                type="hidden"
                name="userId"
                value={actionSearchUsers.value.user.id}
              />

              <button
                type="submit"
                class="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm"
              >
                Agregar al Proyecto
              </button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
});
