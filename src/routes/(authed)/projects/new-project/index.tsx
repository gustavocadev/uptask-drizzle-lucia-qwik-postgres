import { component$ } from '@builder.io/qwik';
import {
  routeAction$,
  z,
  zod$,
  Form,
  routeLoader$,
} from '@builder.io/qwik-city';
import { prisma } from '~/lib/prisma';
import * as dateFns from 'date-fns';
import { auth } from '~/lib/lucia';

export const useCreateProjectAction = routeAction$(
  async (values, event) => {
    // this is to parse the input date to a date object in UTC format
    const deliveryDateUTC = dateFns.parse(
      values.dueDate,
      'yyyy-MM-dd',
      new Date()
    );
    await prisma.project.create({
      data: {
        name: values.name,
        description: values.description,
        deliveryDate: deliveryDateUTC,
        customer: values.customer,
        authorId: values.userId,
      },
    });

    throw event.redirect(303, '/projects');
  },
  zod$({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    dueDate: z.string().min(1).max(100),
    customer: z.string().min(1).max(100),
    userId: z.string(),
  })
);

export const useLoaderUserData = routeLoader$(async (event) => {
  const authRequest = auth.handleRequest(event);
  const { user } = await authRequest.validateUser();
  if (!user)
    return {
      userId: null,
    };

  return {
    userId: user.userId,
  };
});

export default component$(() => {
  const createProjectAction = useCreateProjectAction();
  const userData = useLoaderUserData();

  return (
    <>
      <h1 class="text-4xl font-black">New Project</h1>

      <section class="mt-10 flex justify-center">
        <Form
          action={createProjectAction}
          class="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
        >
          <div class="mb-5">
            <label
              for="name"
              class="text-gray-700 upper
        text-sm font-bold"
            >
              Nombre del proyecto
            </label>
            <input
              type="text"
              id="name"
              class="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
              placeholder="Nombre del pryecto"
              name="name"
            />
          </div>

          <div class="mb-5">
            <label
              for="description"
              class="text-gray-700 upper
        text-sm font-bold"
            >
              Nombre del proyecto
            </label>
            <textarea
              id="description"
              class="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
              placeholder="descripcion del pryecto"
              name="description"
            />
          </div>
          <div class="mb-5">
            <label
              for="due-date"
              class="text-gray-700 upper
        text-sm font-bold"
            >
              Fecha de entrega
            </label>
            <input
              type="date"
              id="due-date"
              class="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
              placeholder="Nombre del pryecto"
              name="dueDate"
            />
          </div>

          <div class="mb-5">
            <label
              for="customer"
              class="text-gray-700 upper
        text-sm font-bold"
            >
              Nombre del cliente
            </label>
            <input
              type="text"
              id="customer"
              class="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
              placeholder="Nombre del pryecto"
              name="customer"
            />
          </div>

          <input type="hidden" name="userId" value={userData.value.userId} />

          <button
            type="submit"
            class="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded hover:bg-sky-700 transition-colors"
          >
            Crear proyecto
          </button>
        </Form>
      </section>
    </>
  );
});
