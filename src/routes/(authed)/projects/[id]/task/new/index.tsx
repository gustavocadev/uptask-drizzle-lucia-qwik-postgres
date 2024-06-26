import { $, component$, useContext } from '@builder.io/qwik';
import { routeLoader$, useNavigate } from '@builder.io/qwik-city';
import { SocketContext } from '~/context/socket/SocketContext';

export const useLoaderTask = routeLoader$(({ params }) => {
  return {
    projectId: params.id,
  };
});

const priorities = ['low', 'medium', 'high'];

export default component$(() => {
  const loaderTask = useLoaderTask();
  const { socket } = useContext(SocketContext);
  const nav = useNavigate();

  const handleSubmit = $(async (e: SubmitEvent) => {
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const task = {
      name: formData.get('name'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      dueDate: formData.get('dueDate'),
      projectId: formData.get('projectId'),
    };

    socket.value?.send(
      JSON.stringify({
        type: 'new-task',
        payload: task,
      })
    );
    await nav(`/projects/${loaderTask.value.projectId}`);
  });

  return (
    <>
      <div class="sm:flex sm:items-start">
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
          <h3 class="text-4xl leading-6 font-bold text-gray-900">
            Crear Tarea
          </h3>
          <form class="mt-10" onSubmit$={handleSubmit} preventdefault:submit>
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
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                {priorities.map((priority) => (
                  <option value={priority} key={priority}>
                    {priority}
                  </option>
                ))}
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
              />
            </div>

            <input
              type="hidden"
              name="projectId"
              value={loaderTask.value.projectId}
            />
            <button
              type="submit"
              class="bg-sky-600 hover:bg-sky-700 p-3 text-white uppercase font-bold transition-colors rounded text-sm w-full"
            >
              Crear
            </button>
          </form>
        </div>
      </div>
    </>
  );
});
