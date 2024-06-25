import {
  Slot,
  component$,
  useContextProvider,
  useSignal,
} from '@builder.io/qwik';
import { TaskContext } from './TaskContext';
import type { Task } from '~/server/services/task/entities/task';

export const TaskProvider = component$(() => {
  const tasks = useSignal<Task[]>([]);

  useContextProvider(TaskContext, {
    tasks,
  });
  return <Slot />;
});
