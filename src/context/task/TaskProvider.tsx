import {
  $,
  Slot,
  component$,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
} from '@builder.io/qwik';
import { TaskContext } from './TaskContext';
import { SocketContext } from '../socket/SocketContext';
import type { Task } from '~/server/services/task/entities/task';
import { useLocation } from '@builder.io/qwik-city';
import type { UpdateTaskState } from './types/update-task-state';
import type { UpdateTask } from './types/update-task';

// we need to create a task provider to get the tasks from the server (websocket) otherwise we will not have any tasks to display when using the <Link /> component
export const TaskProvider = component$(() => {
  const { socket } = useContext(SocketContext);
  const tasks = useSignal<Task[]>([]);
  const loc = useLocation();

  useTask$(({ track, cleanup }) => {
    track(() => [socket.value, loc.params.id]);
    if (!socket.value) return;

    const onMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'get-tasks') {
        tasks.value = data.payload;
      }
    };

    socket.value.addEventListener('message', onMessage);

    cleanup(() => {
      socket.value?.removeEventListener('message', onMessage);
    });
  });

  const getTasksByProjectId = $((projectId: string): void => {
    tasks.value = [];
    // I need to send the projectId to the server to get the tasks for that project
    socket.value?.send(
      JSON.stringify({
        type: 'get-tasks',
        payload: { projectId },
      })
    );
  });

  const deleteTaskById = $((taskId: string, projectId: string): void => {
    // I need to send the taskId to the server to delete the task
    socket.value?.send(
      JSON.stringify({
        type: 'delete-task',
        payload: { taskId, projectId },
      })
    );
  });

  const updateTaskState = $(
    ({ taskId, taskState, userId, projectId }: UpdateTaskState): void => {
      socket?.value?.send(
        JSON.stringify({
          type: 'update-task-state',
          payload: { taskId, taskState, userId, projectId },
        })
      );
    }
  );

  const updateTask = $(({ newTask, projectId, taskId }: UpdateTask): void => {
    socket.value?.send(
      JSON.stringify({
        type: 'update-task',
        payload: {
          taskId,
          newTask,
          projectId,
        },
      })
    );
  });

  useContextProvider(
    TaskContext,
    useStore({
      tasks,
      getTasksByProjectId,
      deleteTaskById,
      updateTaskState,
      updateTask,
    })
  );
  return <Slot />;
});
