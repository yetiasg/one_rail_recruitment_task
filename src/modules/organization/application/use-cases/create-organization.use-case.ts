import { Injectable } from "@kernel/di/injectable.decorator";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { type OrganizationRepositoryPort } from "../ports/organization-repository.port";

export interface CreateOrganizationInput {
  name: string;
  industry: string;
  dateFounded: Date;
}

@Injectable()
export class CreateOrganizationUseCase {
  constructor(private readonly orgRepo: OrganizationRepositoryPort) {}

  async execute({
    name,
    industry,
    dateFounded,
  }: CreateOrganizationInput): Promise<Organization> {
    const organization = new Organization(
      crypto.randomUUID(),
      name,
      industry,
      dateFounded,
    );
    return this.orgRepo.create(organization);
  }
}
