/* eslint-disable @typescript-eslint/require-await */
import { UserRepositoryPort } from "@modules/user/application/ports/user-repository.port";

import { User } from "@modules/user/domain/entities/user.entity";
import {
  FindPagedRepoQuery,
  FindPagedRepoResult,
} from "@shared/application/pagination/pagination.type";

export class FakeUserRepository implements Partial<UserRepositoryPort> {
  private users: User[] = [];

  seed(users: User[]): void {
    this.users = users.slice();
  }

  async findPaged<F extends string>(
    query: FindPagedRepoQuery<F>,
  ): Promise<FindPagedRepoResult<User>> {
    const sorted = this.users.slice().sort((a, b) => {
      const cmp = a.email.localeCompare(b.email);
      return query.orderBy.direction === "asc" ? cmp : -cmp;
    });

    const rows = sorted.slice(query.offset, query.offset + query.limit);

    return { rows, total: this.users.length };
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.users.some((u) => u.email === email);
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const created = new User(
      `id-${this.users.length + 1}`,
      user.firstName,
      user.lastName,
      user.email,
      user.organizationId,
      user.dateCreated,
    );
    this.users.push(created);
    return created;
  }

  // async existsById(id: User["id"]): Promise<boolean> {
  //   throw new Error("Method not implemented.");
  // }

  // async existByEmail(email: User["email"]): Promise<boolean> {
  //   throw new Error("Method not implemented.");
  // }

  // async findById(id: User["id"]): Promise<User | null> {
  //   throw new Error("Method not implemented.");
  // }

  // async update(user: User): Promise<User> {
  //   throw new Error("Method not implemented.");
  // }

  // async delete(id: User["id"]): Promise<boolean> {
  //   throw new Error("Method not implemented.");
  // }
}
