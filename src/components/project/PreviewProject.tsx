import { component$ } from '@builder.io/qwik';
import type { Project } from '~/server/services/project/entities/project';

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
              {''} {project.customerName}
            </span>
          </p>

          {project.userId !== authUserId && (
            <p class="p-1 text-xs rounded-lg text-white bg-green-500 font-bold uppercase">
              Colaborador
            </p>
          )}
        </div>

        <a
          href={`/projects/${project.id}`}
          class="text-gray-600 hover:text-gray-800 uppercase text-sm font-bold"
        >
          Ver Proyecto
        </a>
      </div>
    );
  }
);
