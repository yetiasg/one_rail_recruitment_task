import { Injectable } from "@kernel/di/injectable.decorator";
import { UserRepositoryPort } from "@modules/user/application/ports/user-repository.port";
import { UserModel } from "../models/user.model";
import { User } from "@modules/user/domain/entities/user.entity";
import { UserPersistenceMapper } from "../mappers/user.persistence-mapper";
import {
  FindPagedRepoQuery,
  FindPagedRepoResult,
} from "@shared/application/pagination/pagination.type";

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryPort {
  async findById(id: User["id"]): Promise<User | null> {
    const user = await UserModel.findByPk(id);
    if (user) return UserPersistenceMapper.toDomain(user);
    return null;
  }

  async existByEmail(email: string): Promise<boolean> {
    const count = await UserModel.count({ where: { email } });
    return count > 0;
  }

  async existsById(id: User["id"]): Promise<boolean> {
    const count = await UserModel.count({ where: { id } });
    return count > 0;
  }

  async findPaged<F extends string>(
    query: FindPagedRepoQuery<F>,
  ): Promise<FindPagedRepoResult<User>> {
    const { rows, count } = await UserModel.findAndCountAll({
      offset: query.offset,
      limit: query.limit,
      order: [[query.orderBy.field, query.orderBy.direction.toUpperCase()]],
    });

    return {
      rows: rows.map((row) => UserPersistenceMapper.toDomain(row)),
      total: count,
    };
  }

  async create(data: User): Promise<User> {
    const user = await UserModel.create({ ...data, updatedAt: new Date() });
    return UserPersistenceMapper.toDomain(user);
  }

  async update(data: User): Promise<User> {
    await UserModel.update(
      { ...data, updatedAt: new Date() },
      {
        where: { id: data.id },
      },
    );
    const updated = (await UserModel.findByPk(data.id))!;
    return UserPersistenceMapper.toDomain(updated);
  }

  async delete(id: User["id"]): Promise<boolean> {
    const user = await UserModel.destroy({ where: { id }, force: true });
    return user > 0;
  }
}
