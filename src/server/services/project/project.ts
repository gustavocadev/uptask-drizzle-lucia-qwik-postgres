import { eq, or } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { contributor, project } from '~/server/db/schema';
import type { CreateProjectDto } from './dto/project';
import { Project } from './entities/project';

export const findOneProject = async (projectId: string): Promise<Project> => {
  const [projectFound] = await db
    .select()
    .from(project)
    .where(eq(project.id, projectId));
  return projectFound;
};

export const findProjectsByUserId = async (
  userId: string
): Promise<Project[]> => {
  const projectsByUser = await db
    .select({
      id: project.id,
      name: project.name,
      description: project.description,
      customerName: project.customerName,
      userId: project.userId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      deliveryDate: project.deliveryDate,
    })
    .from(project)
    .leftJoin(contributor, eq(contributor.projectId, project.id))
    .where(or(eq(project.userId, userId), eq(contributor.userId, userId)));

  return projectsByUser;
};

export const createProject = async ({
  userId,
  customerName,
  deliveryDate,
  description,
  name,
}: CreateProjectDto): Promise<void> => {
  await db.insert(project).values({
    name,
    description,
    customerName: customerName,
    deliveryDate,
    userId,
  });
};
