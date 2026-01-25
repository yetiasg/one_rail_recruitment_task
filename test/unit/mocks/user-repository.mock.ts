/* eslint-disable @typescript-eslint/require-await */

import { User } from "@modules/user/domain/entities/user.entity";
import { UserRepositoryPort } from "@modules/user/domain/ports/user-repository.port";
import {
  FindPagedRepoQuery,
  FindPagedRepoResult,
} from "@shared/pagination/pagination.type";

export class UserRepositoryMock implements UserRepositoryPort {
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

  async existsById(id: User["id"]): Promise<boolean> {
    return this.users.some((user) => user.id === id);
  }

  async existByEmail(email: User["email"]): Promise<boolean> {
    return this.users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async findById(id: User["id"]): Promise<User | null> {
    const user = this.users.find((user) => user.id === id);
    if (user) return user;
    return null;
  }

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async update(user: User): Promise<User> {
    const exist = this.users.find((usr) => usr.id === user.id)!;
    return { ...exist, ...user };
  }

  async delete(id: User["id"]): Promise<boolean> {
    const filtered = this.users.filter((user) => user.id !== id);
    this.users = filtered;
    return true;
  }
}
