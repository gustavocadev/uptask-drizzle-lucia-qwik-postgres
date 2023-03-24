import { component$ } from '@builder.io/qwik';
import {
  Form,
  routeAction$,
  routeLoader$,
  z,
  zod$,
} from '@builder.io/qwik-city';
import { prisma } from '~/server/prisma';
import dateFns from 'date-fns';

export const useActionUpdateTask = routeAction$(
  async (values, request) => {
    const parseDateToUTC = dateFns.parse(
      values.dueDate,
      'yyyy-MM-dd',
      new Date()
    );
    await prisma.task.update({
      where: {
        id: values.taskId,
      },
      data: {
        name: values.name,
        description: values.description,
        priority: values.priority,
        deliveryDate: parseDateToUTC,
      },
    });
    throw request.redirect(303, `/projects/${values.projectId}`);
  },
  zod$({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    priority: z.string().min(1).max(100),
    dueDate: z.string().min(1).max(100),
    taskId: z.string(),
    projectId: z.string(),
  })
);

export const useLoaderTask = routeLoader$(async ({ params }) => {
  const task = await prisma.task.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!task) {
    throw new Error('Task not found');
  }

  // from utc format to input date format in date-fns
  const inputDateFormat = dateFns.format(
    new Date(task.deliveryDate),
    'yyyy-MM-dd'
  );

  return {
    task,
    inputDateFormat,
  };
});

const priorities = ['low', 'medium', 'high'];

export default component$(() => {
  const actionUpdateTask = useActionUpdateTask();
  const loaderTask = useLoaderTask();

  return (
    <>
      <div class="sm:flex sm:items-start">
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
          <h3 class="text-4xl leading-6 font-bold text-gray-900">
            Editar Tarea
          </h3>
          <Form class="mt-10" action={actionUpdateTask}>
            <div class="mb-5">
              <label
                for="name"
                class="block text-gray-700 text-sm font-bold mb-2"
              >
                Nombre de la tarea
              </label>
              <input
                type="text"
                id="name"
                name="name"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nombre de la tarea"
                value={loaderTask.value.task?.name}
              />
            </div>

            <div class="mb-5">
              <label
                for="description"
                class="block text-gray-700 text-sm font-bold mb-2"
              >
                Descipción de la tarea
              </label>
              <textarea
                id="description"
                name="description"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nombre de la tarea"
                value={loaderTask.value.task?.description}
              />
            </div>

            <div class="mb-5">
              <label
                for="priority"
                class="block text-gray-700 text-sm font-bold mb-2"
              >
                Prioridad
              </label>
              <select
                id="priority"
                name="priority"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={loaderTask.value.task?.priority}
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                {priorities.map((priority) => {
                  return (
                    <option value={priority} key={priority}>
                      {priority}
                    </option>
                  );
                })}
              </select>
            </div>

            <div class="mb-5">
              <label
                for="due-date"
                class="block text-gray-700 text-sm font-bold mb-2"
              >
                Fecha de entrega
              </label>
              <input
                type="date"
                id="due-date"
                name="dueDate"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={loaderTask.value.inputDateFormat}
              />
            </div>

            <input
              type="hidden"
              name="taskId"
              value={loaderTask.value.task?.id}
            />
            <input
              type="hidden"
              name="projectId"
              value={loaderTask.value.task?.projectId}
            />
            <button
              type="submit"
              class="bg-sky-600 hover:bg-sky-700 p-3 text-white uppercase font-bold transition-colors rounded text-sm w-full"
            >
              Actualizar tarea
            </button>
          </Form>
        </div>
      </div>
    </>
  );
});
