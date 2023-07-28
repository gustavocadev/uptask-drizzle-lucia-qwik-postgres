import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import type { Project } from '@prisma/client';

export interface PreviewProjectProps {
  project: Project;
  authUserId: string;
}

export const PreviewProject = component$<PreviewProjectProps>(
  ({ project, authUserId }) => {
    return (
      <div class="border-b p-5 flex flex-col md:flex-row justify-between">
        <div class="flex items-center gap-2">
          <p class="flex-1">
            {project.name}

            <span class="text-sm text-gray-500 uppercase">
              {''} {project.customer}
            </span>
          </p>

          {project.authorId !== authUserId && (
            <p class="p-1 text-xs rounded-lg text-white bg-green-500 font-bold uppercase">
              Colaborador
            </p>
          )}
        </div>

        <Link
          href={`/projects/${project.id}`}
          class="text-gray-600 hover:text-gray-800 uppercase text-sm font-bold"
        >
          Ver Proyecto
        </Link>
      </div>
    );
  }
);
