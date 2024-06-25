import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { Link, routeLoader$, useLocation } from '@builder.io/qwik-city';
import Contributor from '~/components/project/Contributor';
import { Task } from '~/components/task/Task';
import { SocketContext } from '~/context/socket/SocketContext';
import { handleRequest } from '~/server/db/lucia';
import { findContributorsByProjectId } from '~/server/services/contributor/contributor';
import { findOneProject } from '~/server/services/project/project';
import type { Task as ITask } from '~/server/services/task/entities/task';
import { findOneUser } from '~/server/services/user/user';

export const useLoaderProject = routeLoader$(async ({ params }) => {
  // the project data
  const project = await findOneProject(params.id);

  return {
    project,
  };
});

export const useLoaderContributors = routeLoader$(async ({ params }) => {
  // all the contributors that belong to the project
  const contributors = await findContributorsByProjectId(params.id);

  return {
    contributors: contributors,
  };
});

export const useLoaderUserAuth = routeLoader$(async ({ cookie, redirect }) => {
  const authRequest = handleRequest({ cookie });

  const { session } = await authRequest.validateUser();

  if (!session) {
    throw redirect(303, '/');
  }

  const user = await findOneUser(session.userId);

  return {
    user,
  };
});

export default component$(() => {
  const loaderProject = useLoaderProject();
  const loaderContributors = useLoaderContributors();
  const loaderUserAuth = useLoaderUserAuth();

  // const { tasks } = useContext(TaskContext);
  const tasks = useSignal<ITask[]>([]);
  const { socket } = useContext(SocketContext);
  const loc = useLocation();

  // this task will be executed only when the socket changes to set query params
  useTask$(({ track }) => {
    track(() => socket.value);
    if (!socket.value) return;

    socket.value.io.opts.query = {
      projectId: loc.params.id,
    };

    socket.value.disconnect().connect();
  });

  // this task will be executed only when the socket changes
  useTask$(({ track }) => {
    track(() => socket.value);

    socket.value?.on('get-tasks', (payload) => {
      tasks.value = payload;
    });
  });

  // yo join the room that means that you will receive the messages from that room
  useTask$(({ track }) => {
    // we need to track the socket because it will change !important
    track(() => socket.value);
    if (!socket.value) return;
    socket.value.emit('open-project', loc.params.id);
  });

  return (
    <>
      <div class="flex justify-between">
        <h1 class="font-black text-4xl">
          {loaderProject.value.project?.name ?? ''}
        </h1>

        {loaderUserAuth.value.user?.id ===
          loaderProject.value.project?.userId && (
          <div class="flex items-center gap-2 text-gray-400 hover:text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width={1.5}
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>

            <Link
              class="uppercase font-bold"
              href={`/projects/edit/${loaderProject.value.project?.id}`}
            >
              Editar
            </Link>
          </div>
        )}
      </div>
      {loaderUserAuth.value.user?.id ===
        loaderProject.value.project?.userId && (
        <Link
          href={`/projects/${loaderProject.value.project?.id}/task/new`}
          // onClick={projectStore.toggleModalFormTask}
          class="text-sm px-5 py-3 w-full md:w-auto rounded uppercase font-bold bg-sky-600 text-white text-center mt-5 flex gap-2 items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width={1.5}
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Nueva Tarea
        </Link>
      )}

      <p class="font-bold text-xl m4-10">Tareas del proyecto</p>
      <div class="bg-white shadow mt-10 rounded-lg">
        {tasks.value.length ? (
          tasks.value.map((task) => (
            <Task
              key={task.id}
              task={task}
              authorId={loaderProject.value.project?.userId ?? ''}
              userAuthId={loaderUserAuth.value.user?.id ?? ''}
            />
          ))
        ) : (
          <p class="text-center my-5 p-10">No hay tareas</p>
        )}
      </div>
      <div class="flex items-center justify-between mt-10">
        <p class="font-bold text-xl">Colaboradores</p>
        {loaderUserAuth.value.user?.id ===
          loaderProject.value.project?.userId && (
          <Link
            class="uppercase font-bold text-gray-400 hover:text-black transition-colors "
            href={`/projects/${loaderProject.value.project?.id}/new-contributor`}
          >
            Agregar colaborador
          </Link>
        )}
      </div>
      <div>
        {loaderContributors.value?.contributors.length ? (
          loaderContributors.value?.contributors.map((contributor) => (
            // <Contributor contributor={contributor} key={contributor.contributors.} />
            <Contributor
              contributor={contributor}
              key={contributor.id}
              projectId={loaderProject.value.project?.id ?? ''}
              authorId={loaderProject.value.project?.userId ?? ''}
              userAuthId={loaderUserAuth.value.user?.id ?? ''}
            />
          ))
        ) : (
          <p class="text-center my-5 p-10">No hay colaboradores</p>
        )}
      </div>
      {/* <ModalFormTask /> */}
    </>
  );
});
