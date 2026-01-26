import { appContainer } from "@kernel/di/app-container";
import { UserRepositoryPort } from "@modules/user/domain/ports/user-repository.port";
import { OrderRepositoryPort } from "@modules/order/domain/ports/order-repository.port";
import { OrganizationRepositoryPort } from "@modules/organization/domain/ports/organization-repository.port";
import { UserRepositoryAdapter } from "@modules/user/adapters/persistence/sequelize/repositories/user.repository.adapter";
import { OrganizationRepositoryAdapter } from "@modules/organization/adapters/sequelize/repositories/organization.repository.adapter";
import { OrderRepositoryAdapter } from "@modules/order/adapters/sequelize/repositories/order.repository.adapter";

export function registerBindings(): void {
  appContainer.bind(OrganizationRepositoryPort, OrganizationRepositoryAdapter);
  appContainer.bind(UserRepositoryPort, UserRepositoryAdapter);
  appContainer.bind(OrderRepositoryPort, OrderRepositoryAdapter);
}
