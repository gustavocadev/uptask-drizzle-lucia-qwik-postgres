import { type Signal, createContextId } from '@builder.io/qwik';
import type { Task } from '@prisma/client';

type TaskContextType = {
  tasks: Signal<Task[]>;
};

export const TaskContext = createContextId<TaskContextType>('task.context');
