import { Injectable } from "@kernel/di/injectable.decorator";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { OrganizationRepositoryPort } from "@modules/organization/domain/ports/organization-repository.port";
import { NotFoundError } from "@shared/errors/not-found.error";

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(private readonly orgRepo: OrganizationRepositoryPort) {}

  async execute(id: Organization["id"]): Promise<Organization> {
    const org = await this.orgRepo.findById(id);
    if (!org) throw new NotFoundError(`Organization not found.`);
    await this.orgRepo.delete(id);
    return org;
  }
}
