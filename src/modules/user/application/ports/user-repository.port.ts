import { User } from "@modules/user/domain/entities/user.entity";
import {
  FindPagedRepoQuery,
  FindPagedRepoResult,
} from "@shared/application/pagination/pagination.type";

export abstract class UserRepositoryPort {
  abstract existsById(id: User["id"]): Promise<boolean>;
  abstract existByEmail(email: User["email"]): Promise<boolean>;
  abstract findPaged<F extends string>(
    query: FindPagedRepoQuery<F>,
  ): Promise<FindPagedRepoResult<User>>;
  abstract findById(id: User["id"]): Promise<User | null>;
  abstract create(user: User): Promise<User>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: User["id"]): Promise<boolean>;
}
