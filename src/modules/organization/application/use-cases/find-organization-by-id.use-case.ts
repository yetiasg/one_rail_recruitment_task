import { Injectable } from "@kernel/di/injectable.decorator";
import { OrganizationRepositoryPort } from "../ports/organization-repository.port";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { NotFoundException } from "@kernel/http/http-exceptions";

@Injectable()
export class FindOrganizationByIdUseCase {
  constructor(private readonly orgRepo: OrganizationRepositoryPort) {}

  async execute(id: Organization["id"]): Promise<Organization> {
    const organization = await this.orgRepo.findById(id);
    if (!organization) throw new NotFoundException("Organization not found");
    return organization;
  }
}
