import { OrganizationRepositoryPort } from "@modules/organization/application/ports/organization-repository.port";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { OrganizationModel } from "../models/organization.model";
import { Injectable } from "@kernel/di/injectable.decorator";
import { OrganizationPersistenceMapper } from "../mappers/organization.persistence-mapper";

@Injectable()
export class OrganizationRepositoryAdapter implements OrganizationRepositoryPort {
  async existsById(id: Organization["id"]): Promise<boolean> {
    const count = await OrganizationModel.count({ where: { id } });
    return count > 0;
  }

  async create(organization: Omit<Organization, "id">): Promise<Organization> {
    const org = await OrganizationModel.create(organization);
    return OrganizationPersistenceMapper.toDomain(org);
  }

  async findAll(): Promise<Organization[]> {
    const rows = await OrganizationModel.findAll();
    return rows.map((row) => OrganizationPersistenceMapper.toDomain(row));
  }

  async delete(id: Organization["id"]): Promise<boolean> {
    const org = await OrganizationModel.destroy({ where: { id }, force: true });
    return org > 0;
  }
}
