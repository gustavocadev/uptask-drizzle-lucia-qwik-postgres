import { eq } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { contributor, project, userTable } from '~/server/db/schema';

export const findContributorsByProjectId = async (projectId: string) => {
  const contributors = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      lastName: userTable.lastName,
    })
    .from(contributor)
    .innerJoin(project, eq(project.id, contributor.projectId))
    .innerJoin(userTable, eq(userTable.id, contributor.userId))
    .where(eq(project.id, projectId));
  return contributors;
};

export const createContributor = async (userId: string, projectId: string) => {
  await db.insert(contributor).values({
    userId,
    projectId,
  });
};
