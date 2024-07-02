import { $, component$, useContext } from '@builder.io/qwik';
import {
  type DocumentHead,
  routeLoader$,
  useNavigate,
} from '@builder.io/qwik-city';
import * as dateFns from 'date-fns';
import { TaskContext } from '~/context/task/TaskContext';
import { findOneTask } from '~/server/services/task/task';
import { parseWithZod } from '@conform-to/zod';
import { z } from '@builder.io/qwik-city';
import { Button } from '~/components/ui/button/button';
import { Input } from '~/components/ui/input/input';
import { Textarea } from '~/components/ui/textarea/textarea';

export const useLoaderTask = routeLoader$(async ({ params }) => {
  const task = await findOneTask(params.id);

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

const priorities = ['low', 'medium', 'high'] as const;

export default component$(() => {
  // const actionUpdateTask = useActionUpdateTask();
  const loaderTask = useLoaderTask();
  const { updateTask } = useContext(TaskContext);
  const nav = useNavigate();

  const handleUpdateTask = $(async (e: SubmitEvent) => {
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);

    const submission = parseWithZod(formData, {
      schema: z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        priority: z.enum(priorities),
        dueDate: z.string(),
      }),
    });

    if (submission.status !== 'success') {
      return '';
    }
    const task = submission.value;

    updateTask({
      newTask: {
        deliveryDate: task.dueDate,
        description: task.description,
        name: task.name,
        priority: task.priority,
      },
      projectId: loaderTask.value.task.projectId!,
      taskId: loaderTask.value.task.id,
    });

    await nav('/projects/' + loaderTask.value.task?.projectId);
  });

  return (
    <>
      <div class="sm:flex sm:items-start">
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full space-y-8">
          <h3 class="text-4xl leading-6 font-bold text-gray-900">
            Editar Tarea
          </h3>
          <form
            class="space-y-4"
            onSubmit$={handleUpdateTask}
            preventdefault:submit
          >
            <div class="space-y-2">
              <label for="name" class="block text-gray-700 text-sm font-bold">
                Nombre de la tarea
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Nombre de la tarea"
                value={loaderTask.value.task?.name}
              />
            </div>

            <div class="space-y-2">
              <label
                for="description"
                class="block text-gray-700 text-sm font-bold"
              >
                Descipción de la tarea
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Nombre de la tarea"
                class="bg-white"
                value={loaderTask.value.task?.description}
              />
            </div>

            <div class="space-y-2">
              <label
                for="priority"
                class="block text-gray-700 text-sm font-bold"
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

            <div class="space-y-2">
              <label
                for="due-date"
                class="block text-gray-700 text-sm font-bold"
              >
                Fecha de entrega
              </label>
              <Input
                type="date"
                id="due-date"
                name="dueDate"
                value={loaderTask.value.inputDateFormat}
              />
            </div>

            <Button type="submit" class="w-full uppercase text-md font-bold">
              Actualizar tarea
            </Button>
          </form>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const task = resolveValue(useLoaderTask);

  return {
    title: `Editar tarea "${task.task.name}"`,
    meta: [
      {
        name: 'description',
        content: task.task.description,
      },
    ],
  };
};
