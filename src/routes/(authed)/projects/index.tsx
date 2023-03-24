import { component$ } from '@builder.io/qwik';
import { PreviewProject } from '~/components/project/PreviewProject';
import { getUserData } from '~/utils/session';
import { prisma } from '~/server/prisma';
import { routeLoader$ } from '@builder.io/qwik-city';

export const useLoaderProjects = routeLoader$(async ({ request, env, url }) => {
  const user = await getUserData(request, env);
  if (!user) {
    return {
      error: 'Not logged in',
    };
  }

  const projectsByUser = await prisma.project.findMany({
    where: {
      OR: [
        {
          authorId: user.id,
        },
        {
          contributorIDs: {
            has: user.id,
          },
        },
      ],
    },
  });

  // search for params if there is a search param
  const projectName = url.searchParams.get('search');

  // if there is a search param, filter the projects by the search param
  if (projectName) {
    const projects = projectsByUser.filter((project) => {
      return project.name.toLowerCase().includes(projectName.toLowerCase());
    });

    return {
      projectsByUser: projects,
    };
  }

  // if there is no search param, return all the projects
  return {
    projectsByUser,
  };
});

export const userLoaderUser = routeLoader$(async ({ request, env }) => {
  const user = await getUserData(request, env);

  return {
    user,
  };
});

export default component$(() => {
  const loaderProjects = useLoaderProjects();
  const loaderUser = userLoaderUser();

  return (
    <>
      <h1 class="text-4xl font-black">Projects</h1>
      <div class="bg-white shadow mt-10 rounded-lg ">
        {loaderProjects.value?.projectsByUser?.map((project) => (
          <PreviewProject
            project={project}
            key={project.id}
            authUserId={loaderUser.value.user?.id ?? ''}
          />
        ))}
      </div>
    </>
  );
});
