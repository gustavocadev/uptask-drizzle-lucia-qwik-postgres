import { eq } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { task } from '~/server/db/schema';

export const findOneTask = async (taskId: string) => {
  const [taskFound] = await db.select().from(task).where(eq(task.id, taskId));
  return taskFound;
};
