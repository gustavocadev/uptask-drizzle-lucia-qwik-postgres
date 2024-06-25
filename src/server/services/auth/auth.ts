import { eq } from 'drizzle-orm';
import { verifyPassword } from 'qwik-lucia';
import { db } from '~/server/db/db';
import { lucia } from '~/server/db/lucia';
import { userTable } from '~/server/db/schema';

export const login = async (email: string, password: string) => {
  try {
    const [user] = await db
      .select({
        id: userTable.id,
        passwordHash: userTable.passwordHash,
        email: userTable.email,
      })
      .from(userTable)
      .where(eq(userTable.email, email));

    //2. if user is not found, throw error
    if (!user) {
      return {
        message: 'Incorrect username or password',
        session: null,
      };
    }

    // 3. validate password
    const isValidPassword = await verifyPassword(user.passwordHash, password);

    if (!isValidPassword) {
      return {
        message: 'Incorrect username or password',
        session: null,
      };
    }

    // 4. create session
    const session = await lucia.createSession(user.id, {});

    return {
      message: 'Login successful',
      session,
    };
  } catch (error) {
    console.error('login error', error);
    return {
      message: 'An error occurred. Please try again',
      session: null,
    };
  }
};

export const signup = () => {
  //  do something
};

export const signout = () => {
  // do something
};
