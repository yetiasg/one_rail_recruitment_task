import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { OrderBy } from "@shared/application/pagination/pagination.type";

export interface FindOrganizationsRepoQuery {
  offset: number;
  limit: number;
  orderBy: OrderBy<"name">;
}

export interface FindOrganizationsRepoResult {
  rows: Organization[];
  total: number;
}

export abstract class OrganizationRepositoryPort {
  abstract findPaged(
    query: FindOrganizationsRepoQuery,
  ): Promise<FindOrganizationsRepoResult>;

  abstract existsById(id: Organization["id"]): Promise<boolean>;
  abstract findById(id: Organization["id"]): Promise<Organization | null>;
  abstract create(organization: Organization): Promise<Organization>;
  abstract update(organization: Organization): Promise<Organization>;
  abstract delete(id: Organization["id"]): Promise<boolean>;
}
