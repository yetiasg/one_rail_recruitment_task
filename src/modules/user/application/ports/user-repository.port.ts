import { User } from "@modules/user/domain/entities/user.entity";
import { SortDirection } from "../use-cases/find-users/find-users.types";

export interface FindUsersRepoQuery {
  offset: number;
  limit: number;
  orderBy: { field: "email"; direction: SortDirection };
}

export interface FindUsersRepoResult {
  rows: User[];
  total: number;
}

export abstract class UserRepositoryPort {
  abstract existsById(id: User["id"]): Promise<boolean>;
  abstract existByEmail(email: User["email"]): Promise<boolean>;
  abstract findPaged(query: FindUsersRepoQuery): Promise<FindUsersRepoResult>;
  abstract findById(id: User["id"]): Promise<User | null>;
  abstract create(user: User): Promise<User>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: User["id"]): Promise<boolean>;
}
