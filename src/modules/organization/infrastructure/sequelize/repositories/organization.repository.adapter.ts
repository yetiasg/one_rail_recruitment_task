import { OrganizationRepositoryPort } from "@modules/organization/application/ports/organization-repository.port";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { OrganizationModel } from "../models/organization.model";
import { Injectable } from "@kernel/di/injectable.decorator";
import { OrganizationPersistenceMapper } from "../mappers/organization.persistence-mapper";
import {
  FindPagedRepoQuery,
  FindPagedRepoResult,
} from "@shared/application/pagination/pagination.type";

@Injectable()
export class OrganizationRepositoryAdapter implements OrganizationRepositoryPort {
  async findById(id: Organization["id"]): Promise<Organization | null> {
    const org = await OrganizationModel.findByPk(id);
    if (!org) return null;
    return OrganizationPersistenceMapper.toDomain(org);
  }

  async existsById(id: Organization["id"]): Promise<boolean> {
    const count = await OrganizationModel.count({ where: { id } });
    return count > 0;
  }

  async findPaged<F extends string>(
    query: FindPagedRepoQuery<F>,
  ): Promise<FindPagedRepoResult<Organization>> {
    const { rows, count } = await OrganizationModel.findAndCountAll({
      offset: query.offset,
      limit: query.limit,
      order: [[query.orderBy.field, query.orderBy.direction.toUpperCase()]],
    });

    return {
      rows: rows.map((row) => OrganizationPersistenceMapper.toDomain(row)),
      total: count,
    };
  }

  async create(data: Omit<Organization, "id">): Promise<Organization> {
    const org = await OrganizationModel.create(data);
    return OrganizationPersistenceMapper.toDomain(org);
  }

  async update(data: Organization): Promise<Organization> {
    await OrganizationModel.update(data, {
      where: { id: data.id },
    });
    const updated = (await OrganizationModel.findByPk(data.id))!;
    return OrganizationPersistenceMapper.toDomain(updated);
  }

  async delete(id: Organization["id"]): Promise<boolean> {
    const org = await OrganizationModel.destroy({ where: { id }, force: true });
    return org > 0;
  }
}
