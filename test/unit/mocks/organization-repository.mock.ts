/* eslint-disable @typescript-eslint/require-await */
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { OrganizationRepositoryPort } from "@modules/organization/domain/ports/organization-repository.port";
import {
  FindPagedRepoQuery,
  FindPagedRepoResult,
} from "@shared/pagination/pagination.type";

export class OrganizationRepositoryMock implements OrganizationRepositoryPort {
  private organizations: Organization[] = [];

  seed(organizations: Organization[]): void {
    this.organizations = organizations;
  }

  async findPaged<F extends string>(
    query: FindPagedRepoQuery<F>,
  ): Promise<FindPagedRepoResult<Organization>> {
    const sorted = this.organizations.slice().sort((a, b) => {
      const cmp = +(a.dateFounded.getTime() > b.dateFounded.getTime());
      return query.orderBy.direction === "asc" ? cmp : -cmp;
    });

    const rows = sorted.slice(query.offset, query.offset + query.limit);
    return { rows, total: this.organizations.length };
  }

  async existsById(id: Organization["id"]): Promise<boolean> {
    return this.organizations.some((org) => org.id === id);
  }

  async findById(id: Organization["id"]): Promise<Organization | null> {
    const organization = this.organizations.find((org) => org.id === id);
    if (organization) return organization;
    return null;
  }

  async create(organization: Organization): Promise<Organization> {
    this.organizations.push(organization);
    return organization;
  }

  async update(organization: Organization): Promise<Organization> {
    const exist = this.organizations.find((org) => org.id === organization.id)!;
    return { ...exist, ...organization };
  }

  async delete(id: Organization["id"]): Promise<boolean> {
    const filtered = this.organizations.filter((org) => org.id !== id);
    this.organizations = filtered;
    return true;
  }
}
