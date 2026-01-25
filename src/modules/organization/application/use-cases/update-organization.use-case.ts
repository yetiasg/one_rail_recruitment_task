import { Injectable } from "@kernel/di/injectable.decorator";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { OrganizationRepositoryPort } from "@modules/organization/domain/ports/organization-repository.port";
import { NotFoundError } from "@shared/errors/not-found.error";

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
    if (!org) throw new NotFoundError("Organization not found");
    return this.orgRepo.update({ ...org, ...data });
  }
}
