import type { Task } from '~/server/services/task/entities/task';

export type UpdateTask = {
  taskId: string;
  newTask: Pick<Task, 'name' | 'description' | 'priority'> & {
    deliveryDate: string;
  };
  projectId: string;
};
