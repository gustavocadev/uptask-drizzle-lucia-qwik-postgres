import { component$ } from '@builder.io/qwik';
import { PreviewProject } from '~/components/project/PreviewProject';
import { routeLoader$ } from '@builder.io/qwik-city';
import { handleRequest } from '~/server/db/lucia';
import { findProjectsByUserId } from '~/server/services/project/project';
import { findOneUser } from '~/server/services/user/user';

export const useLoaderProjects = routeLoader$(async (event) => {
  const authRequest = handleRequest(event);
  const { session } = await authRequest.validateUser();
  if (!session) throw event.redirect(303, '/login');

  // console.log({ user });

  // get all the projects that the user is the author or contributor
  const projectsByUser = await findProjectsByUserId(session.userId);

  // search for params if there is a search param
  const projectName = event.url.searchParams.get('search');

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

export const userLoaderUser = routeLoader$(async (event) => {
  const authRequest = handleRequest(event);
  const { session } = await authRequest.validateUser();
  if (!session) {
    return {
      error: 'Not logged in',
    };
  }

  const user = await findOneUser(session.userId);

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
