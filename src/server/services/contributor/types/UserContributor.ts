import { User } from '../../user/entities/user';

export type UserContributor = Pick<User, 'id' | 'name' | 'email' | 'lastName'>;
