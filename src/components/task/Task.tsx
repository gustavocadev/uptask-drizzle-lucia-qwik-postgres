import { component$, useSignal, useTask$ } from '@builder.io/qwik';
import { Form, Link, globalAction$, zod$, z } from '@builder.io/qwik-city';
import type { Task as ITask } from '@prisma/client';
import { prisma } from '~/lib/prisma';
import * as dateFns from 'date-fns';

export const useActionToggleState = globalAction$(
  async (values) => {
    const taskState = JSON.parse(values.taskState);
    await prisma.task.update({
      where: {
        id: values.taskId,
      },
      data: {
        state: taskState,
      },
    });
    console.log({ values });
  },
  zod$({
    taskId: z.string(),
    taskState: z.string(),
  })
);

export interface TaskProps {
  task: ITask;
  authorId: string;
  userAuthId: string;
}

export const Task = component$<TaskProps>(({ task, authorId, userAuthId }) => {
  const actionToggleState = useActionToggleState();
  const spanishDateFormat = useSignal('');

  // runs on the server which means it runs before the render the component thanks to resumability
  useTask$(() => {
    // from utc format to input date format in date-fns
    // format from utc to readable date format in spanish

    spanishDateFormat.value = dateFns.format(
      new Date(task.deliveryDate),
      'dd/MM/yyyy'
    );
  });

  return (
    <div class="border-b p-5 flex justify-between items-center">
      <div>
        <p class="mb-1 text-xl">{task.name}</p>
        <p class="mb-1 text-sm text-gray-500 uppercase">{task.description}</p>
        <p class="mb-1 text-xl">{spanishDateFormat}</p>
        <p class="mb-1 text-gray-600">Priority: {task.priority}</p>
        {task.state && (
          <p class="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">
            Completada por: {task.name}
          </p>
        )}
      </div>

      <div class="flex flex-col lg:flex-row gap-2">
        {authorId === userAuthId && (
          <Link
            href={`/projects/${task.projectId}/task/${task.id}/edit`}
            class="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          >
            Editar
          </Link>
        )}

        {task.state ? (
          <Form action={actionToggleState}>
            <input type="hidden" name="taskId" value={task.id} />
            <input type="hidden" name="taskState" value={'false'} />
            <button
              type="submit"
              class="bg-sky-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            >
              Completa
            </button>
          </Form>
        ) : (
          <Form action={actionToggleState}>
            <input type="hidden" name="taskId" value={task.id} />
            <input type="hidden" name="taskState" value={'true'} />

            <button
              type="submit"
              class="bg-gray-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            >
              Incompleta
            </button>
          </Form>
        )}

        {authorId === userAuthId && (
          <button
            type="button"
            class="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
});
