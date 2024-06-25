export type ProjectByUser = {
  id: string;
  name: string;
  description: string;
  customer: string;
  authorId: string;

  createdAt: Date | null;
  updatedAt: Date | null;
};
