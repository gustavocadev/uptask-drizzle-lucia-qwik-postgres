import { serverAuth$ } from '@builder.io/qwik-auth';
import Credentials from '@auth/core/providers/credentials';
import type { Provider } from '@auth/core/providers';
import { prisma } from '~/server/prisma';
import * as bcryptjs from 'bcryptjs';
// env.get('AUTH_SECRET')
export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => ({
    secret: env.get('QWIK_AUTH_SECRET'),
    trustHost: true,
    providers: [
      Credentials({
        name: 'Login',
        authorize: async (credentials) => {
          console.log({ credentials });
          // todo: validate credentials with database
          const user = await prisma.user.findFirst({
            where: {
              email: credentials?.email as string,
            },
          });

          console.log({ user });

          const isPasswordValid = await bcryptjs.compare(
            credentials?.password as string,
            user?.password as string
          );

          console.log({ isPasswordValid });

          if (!isPasswordValid) {
            return null;
          }

          return user;
        },
        credentials: {
          email: {
            label: 'Email',
            type: 'text',
          },
          password: {
            label: 'Password',
            type: 'text',
          },
        },
      }),
    ] as Provider[],
    // pages: {
    //   signIn: '/',
    // },
  }));
