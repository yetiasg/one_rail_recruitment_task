import { Injectable } from "@kernel/di/injectable.decorator";
import { OrganizationRepositoryPort } from "../ports/organization-repository.port";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { NotFoundException } from "@kernel/http/http-exceptions";

@Injectable()
export class DeleteOrganizationUseCase {
  constructor(private readonly orgRepo: OrganizationRepositoryPort) {}

  async execute(id: Organization["id"]): Promise<Organization> {
    const org = await this.orgRepo.findById(id);
    if (!org) throw new NotFoundException(`Organization not found.`);
    await this.orgRepo.delete(id);
    return org;
  }
}
