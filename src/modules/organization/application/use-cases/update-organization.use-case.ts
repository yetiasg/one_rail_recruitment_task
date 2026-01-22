import { Injectable } from "@kernel/di/injectable.decorator";
import { OrganizationRepositoryPort } from "../ports/organization-repository.port";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { NotFoundException } from "@kernel/http/http-exceptions";

export interface UpdateOrganizationInput {
  name: string;
  industry: string;
  dateFounded: Date;
}

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(private readonly orgRepo: OrganizationRepositoryPort) {}

  async execute(id: Organization["id"], data: UpdateOrganizationInput) {
    const org = await this.orgRepo.findById(id);
    if (!org) throw new NotFoundException("Organization not found");
    return this.orgRepo.update({ ...org, ...data });
  }
}
