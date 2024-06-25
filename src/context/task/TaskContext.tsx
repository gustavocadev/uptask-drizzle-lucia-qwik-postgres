import { type Signal, createContextId } from '@builder.io/qwik';
import type { Task } from '~/server/services/task/entities/task';

type TaskContextType = {
  tasks: Signal<Task[]>;
};

export const TaskContext = createContextId<TaskContextType>('task.context');
