import { eq } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { task } from '~/server/db/schema';
import { Task } from './entities/task';

export const findOneTask = async (taskId: string): Promise<Task> => {
  const [taskFound] = await db.select().from(task).where(eq(task.id, taskId));
  return taskFound;
};
