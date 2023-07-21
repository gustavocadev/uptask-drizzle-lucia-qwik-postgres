import {
  Slot,
  component$,
  useContextProvider,
  useSignal,
} from '@builder.io/qwik';
import { TaskContext } from './TaskContext';
import type { Task } from '@prisma/client';

export const TaskProvider = component$(() => {
  const tasks = useSignal<Task[]>([]);

  useContextProvider(TaskContext, {
    tasks,
  });
  return <Slot />;
});
