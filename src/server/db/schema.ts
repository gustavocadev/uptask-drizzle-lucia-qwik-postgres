import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { generateId } from 'lucia';

export const userTable = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  passwordHash: varchar('password_hash').notNull(),
  username: varchar('username'),
  // other user attributes
  name: varchar('name', {
    length: 55,
  }).notNull(),
  lastName: varchar('last_name', {
    length: 55,
  }).notNull(),
  email: varchar('email', {
    length: 100,
  }).notNull(),

  isConfirmed: boolean('is_confirmed').notNull().default(false),
  token: text('token'),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
});

export type SelectUser = typeof userTable.$inferSelect;

export const userRelations = relations(userTable, ({ many }) => ({
  project: many(project),
}));

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

export type SelectSession = typeof sessionTable.$inferSelect;

export const project = pgTable('project', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId(15)),

  name: text('name').notNull(),
  description: text('description').notNull(),
  customerName: text('customer_name').notNull(),
  deliveryDate: timestamp('delivery_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),

  // the author of the project
  userId: text('user_id')
    .references(() => userTable.id)
    .notNull(),
});
export type SelectProject = typeof project.$inferSelect;

export const projectRelations = relations(project, ({ one, many }) => ({
  userTable: one(userTable, {
    fields: [project.userId],
    references: [userTable.id],
  }),

  contributor: many(contributor),
  task: many(task),
}));

export const contributor = pgTable('contributor', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  userId: text('user_id')
    .references(() => userTable.id)
    .notNull(),
  projectId: text('project_id')
    .references(() => project.id)
    .notNull(),
});

export type SelectContributor = typeof contributor.$inferSelect;

export const contributorRelations = relations(contributor, ({ one }) => ({
  user: one(userTable, {
    fields: [contributor.userId],
    references: [userTable.id],
  }),
  project: one(project, {
    fields: [contributor.projectId],
    references: [project.id],
  }),
}));

export const task = pgTable('task', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => generateId(15)),
  name: text('name').notNull(),
  description: text('description').notNull(),
  priority: text('priority').notNull(),
  state: boolean('state').notNull(),

  deliveryDate: timestamp('delivery_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),

  projectId: text('project_id').references(() => project.id),

  userWhoCompletedTaskId: text('user_who_completed_task_id').references(
    () => userTable.id
  ),
});

export type SelectTask = typeof task.$inferSelect;

export const taskRelations = relations(task, ({ one }) => ({
  project: one(project, {
    fields: [task.projectId],
    references: [project.id],
  }),
  userWhoCompletedTask: one(userTable, {
    fields: [task.userWhoCompletedTaskId],
    references: [userTable.id],
  }),
}));
