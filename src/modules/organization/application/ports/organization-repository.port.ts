import { Organization } from "@modules/organization/domain/entities/organization.entity";
import {
  FindPagedRepoQuery,
  FindPagedRepoResult,
} from "@shared/application/pagination/pagination.type";

export abstract class OrganizationRepositoryPort {
  abstract findPaged<F extends string>(
    query: FindPagedRepoQuery<F>,
  ): Promise<FindPagedRepoResult<Organization>>;
  abstract existsById(id: Organization["id"]): Promise<boolean>;
  abstract findById(id: Organization["id"]): Promise<Organization | null>;
  abstract create(organization: Organization): Promise<Organization>;
  abstract update(organization: Organization): Promise<Organization>;
  abstract delete(id: Organization["id"]): Promise<boolean>;
}
