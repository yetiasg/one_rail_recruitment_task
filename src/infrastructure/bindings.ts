import { appContainer } from "@kernel/di/app-container";
import { OrderRepositoryPort } from "@modules/order/application/ports/order-repository.port";
import { OrderRepositoryAdapter } from "@modules/order/infrastructure/sequelize/repositories/order.repository.adapter";
import { OrganizationRepositoryPort } from "@modules/organization/application/ports/organization-repository.port";
import { OrganizationRepositoryAdapter } from "@modules/organization/infrastructure/sequelize/repositories/organization.repository.adapter";
import { UserRepositoryPort } from "@modules/user/application/ports/user-repository.port";
import { UserRepositoryAdapter } from "@modules/user/infrastructure/persistence/sequelize/repositories/user.repository.adapter";
import { CachePort } from "src/core/cache/cache.port";
import { RedisCacheAdapter } from "./redis/redis.adapter";

export function registerBindings(): void {
  appContainer.bind(OrganizationRepositoryPort, OrganizationRepositoryAdapter);
  appContainer.bind(UserRepositoryPort, UserRepositoryAdapter);
  appContainer.bind(OrderRepositoryPort, OrderRepositoryAdapter);
  appContainer.bind(CachePort, RedisCacheAdapter);
}
