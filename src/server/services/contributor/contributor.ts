import { and, eq } from 'drizzle-orm';
import { db } from '~/server/db/db';
import { contributor, project, userTable } from '~/server/db/schema';
import { UserContributor } from './types/UserContributor';

export const findContributorsByProjectId = async (
  projectId: string
): Promise<UserContributor[]> => {
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

export const createContributor = async (
  userId: string,
  projectId: string
): Promise<void> => {
  await db.insert(contributor).values({
    userId,
    projectId,
  });
};

export const removeOneContributor = async (
  projectId: string,
  contributorId: string
): Promise<void> => {
  await db
    .delete(contributor)
    .where(
      and(
        eq(contributor.projectId, projectId),
        eq(contributor.id, contributorId)
      )
    );
};
