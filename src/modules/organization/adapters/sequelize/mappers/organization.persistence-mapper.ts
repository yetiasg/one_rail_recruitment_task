import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { OrganizationModel } from "../models/organization.model";

export class OrganizationPersistenceMapper {
  static toDomain(row: OrganizationModel): Organization {
    return new Organization(row.id, row.name, row.industry, row.dateFounded);
  }
}
