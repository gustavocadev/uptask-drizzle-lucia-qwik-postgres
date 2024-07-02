import { type Signal, createContextId, type QRL } from '@builder.io/qwik';
import type { Task } from '~/server/services/task/entities/task';
import type { UpdateTaskState } from './types/update-task-state';
import type { UpdateTask } from './types/update-task';

type ITaskContext = {
  tasks: Signal<Task[]>;
  getTasksByProjectId: QRL<(projectId: string) => void>;
  deleteTaskById: QRL<(taskId: string, projectId: string) => void>;
  updateTaskState: QRL<(taskState: UpdateTaskState) => void>;
  updateTask: QRL<(updateTask: UpdateTask) => void>;
};

export const TaskContext = createContextId<ITaskContext>('task.context');
