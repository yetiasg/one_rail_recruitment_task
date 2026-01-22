import { appContainer } from "@kernel/di/app-container";
import { OrganizationRepositoryPort } from "@modules/organization/application/ports/organization-repository.port";
import { OrganizationRepositoryAdapter } from "@modules/organization/infrastructure/sequelize/repositories/organization.repository.adapter";
import { UserRepositoryPort } from "@modules/user/application/ports/user-repository.port";
import { UserRepositoryAdapter } from "@modules/user/infrastructure/persistence/sequelize/repositories/user.repository.adapter";

export function registerBindings(): void {
  appContainer.bind(OrganizationRepositoryPort, OrganizationRepositoryAdapter);
  appContainer.bind(UserRepositoryPort, UserRepositoryAdapter);
}
