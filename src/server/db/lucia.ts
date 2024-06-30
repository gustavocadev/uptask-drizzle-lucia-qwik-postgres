// src/server/lucia.ts
import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { qwikLuciaConfig } from 'qwik-lucia';
import { db } from './db';
import { type SelectUser, sessionTable, userTable } from './schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: import.meta.env.PROD,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    };
  },
});

/*
IMPORTANT!
Here we need to use `qwikLuciaConfig` to correctly configure the `handleRequest` function
*/
export const { handleRequest } = qwikLuciaConfig(lucia);

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<SelectUser, 'id'>;
  }
}
