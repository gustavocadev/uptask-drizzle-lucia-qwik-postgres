import { type Signal, createContextId, type QRL } from '@builder.io/qwik';
import type { Task } from '~/server/services/task/entities/task';

type ITaskContext = {
  tasks: Signal<Task[]>;
  getTasksByProjectId: QRL<(projectId: string) => void>;
};

export const TaskContext = createContextId<ITaskContext>('task.context');
