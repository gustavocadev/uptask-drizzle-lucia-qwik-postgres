import { eq, or } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { contributor, project, userTable } from '~/server/db/schema';
import type { ProjectByUser } from './types/project';

export const findOneProject = async (projectId: string) => {
  const [projectFound] = await db
    .select()
    .from(project)
    .where(eq(project.id, projectId));
  return projectFound;
};

export const findProjectsByUserId = async (
  userId: string
): Promise<ProjectByUser[]> => {
  const projectsByUser = await db
    .select({
      id: project.id,
      name: project.name,
      description: project.description,
      customer: project.customerName,
      authorId: project.userId,

      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })
    .from(project)
    .innerJoin(userTable, eq(userTable.id, project.userId))
    .leftJoin(contributor, eq(contributor.projectId, project.id))
    .where(or(eq(project.userId, userId), eq(contributor.userId, userId)));

  return projectsByUser;
};

type CreateProjectDto = {
  name: string;
  userId: string;
  customerName: string;
  deliveryDate: Date;
  description: string;
};

export const createProject = async ({
  userId,
  customerName,
  deliveryDate,
  description,
  name,
}: CreateProjectDto) => {
  console.log({
    userId,
    customerName,
    deliveryDate,
    description,
    name,
  });

  await db.insert(project).values({
    name,
    description,
    customerName: customerName,
    deliveryDate,
    userId,
  });
};
