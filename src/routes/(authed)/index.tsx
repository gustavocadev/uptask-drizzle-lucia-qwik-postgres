import type { RequestHandler } from '@builder.io/qwik-city';
import { handleRequest } from '~/server/db/lucia';

export const onGet: RequestHandler = async ({ redirect, cookie }) => {
  const authRequest = handleRequest({ cookie });
  const { session } = await authRequest.validateUser();
  if (!session) throw redirect(303, '/login');

  throw redirect(303, '/projects');
};
