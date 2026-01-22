import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { Injectable } from "@kernel/di/injectable.decorator";
import {
  FindUsersRepoQuery,
  FindUsersRepoResult,
  UserRepositoryPort,
} from "@modules/user/application/ports/user-repository.port";
import { UserModel } from "../models/user.model";
import { User } from "@modules/user/domain/entities/user.entity";
import { UserPersistenceMapper } from "../mappers/user.persistence-mapper";

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

  async existsById(id: Organization["id"]): Promise<boolean> {
    const count = await UserModel.count({ where: { id } });
    return count > 0;
  }

  async findPaged(query: FindUsersRepoQuery): Promise<FindUsersRepoResult> {
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

  async create(organization: Omit<User, "id">): Promise<User> {
    const org = await UserModel.create(organization);
    return UserPersistenceMapper.toDomain(org);
  }

  async update(data: User): Promise<User> {
    const [, user] = await UserModel.update(data, {
      where: { id: data.id },
      returning: true,
    });
    return UserPersistenceMapper.toDomain(user[0]);
  }

  async delete(id: Organization["id"]): Promise<boolean> {
    const org = await UserModel.destroy({ where: { id }, force: true });
    return org > 0;
  }
}
