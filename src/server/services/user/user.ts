import { eq } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { userTable } from '~/server/db/schema';
import { User } from './entities/user';

export const findOneUser = async (userId: string): Promise<User> => {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId));
  return user;
};

export const findOneUserByEmail = async (userEmail: string): Promise<User> => {
  const [user] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, userEmail));
  return user;
};
