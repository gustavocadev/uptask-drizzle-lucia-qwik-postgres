import { eq } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { userTable } from '~/server/db/schema';

export const findOneUser = async (userId: string) => {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId));
  return user;
};

export const findOneUserByEmail = async (userEmail: string) => {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, userEmail));
  return user;
};
