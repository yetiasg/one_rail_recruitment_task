import { Injectable } from "@kernel/di/injectable.decorator";
import { type OrganizationRepositoryPort } from "../ports/organization-repository.port";
import { Organization } from "@modules/organization/domain/entities/organization.entity";

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(private readonly orgRepo: OrganizationRepositoryPort) {}

  async execute(id: Organization["id"]): Promise<boolean> {
    const organizationExist = await this.orgRepo.existsById(id);
    if (!organizationExist) throw new Error(`Organization ${id} not found.`);
    return this.orgRepo.delete(id);
  }
}
