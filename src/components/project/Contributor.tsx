import { component$ } from '@builder.io/qwik';
import type { AuthUser } from '@prisma/client';
import { Form, globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { prisma } from '~/lib/prisma';

export const useActionRemoveContributor = globalAction$(
  async (values) => {
    // delete one contributor from the project contributors
    await prisma.project.update({
      where: {
        id: values.projectId,
      },
      data: {
        contributors: {
          // we use the disconnect method to delete the contributor only from the model of the project
          disconnect: {
            id: values.contributorId,
          },
        },
      },
    });

    return {
      success: true,
    };
  },
  zod$({
    contributorId: z.string(),
    projectId: z.string(),
  })
);

type Props = {
  contributor: AuthUser;
  projectId: string;
  authorId: string;
  userAuthId: string;
};

export default component$(
  ({ contributor, projectId, authorId, userAuthId }: Props) => {
    const actionRemoveContributor = useActionRemoveContributor();
    return (
      <div class="border-b p-5 flex justify-between items-center bg-white rounded">
        <div>
          <p>{contributor.name}</p>
          <p class="text-sm text-gray-700">{contributor.email}</p>
        </div>

        {authorId === userAuthId && (
          <Form action={actionRemoveContributor}>
            <input type="hidden" name="projectId" value={projectId} />

            <input type="hidden" name="contributorId" value={contributor.id} />

            <button
              type="submit"
              class="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            >
              Eliminar
            </button>
          </Form>
        )}
      </div>
    );
  }
);
