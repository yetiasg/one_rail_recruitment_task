import { Injectable } from "@kernel/di/injectable.decorator";
import { type OrganizationRepositoryPort } from "@modules/organization/application/ports/organization-repository.port";
import { type UserRepositoryPort } from "@modules/user/application/ports/user-repository.port";
import { type OrderRepositoryPort } from "../ports/order-repository.port";
import { Order } from "@modules/order/domain/entities/order.entity";

export interface CreateOrderInput {
  userId: string;
  organizationId: string;
  totalAmount: number;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orgRepo: OrganizationRepositoryPort,
    private readonly userRepo: UserRepositoryPort,
    private readonly orderRepo: OrderRepositoryPort,
  ) {}

  async execute({
    userId,
    organizationId,
    totalAmount,
  }: CreateOrderInput): Promise<Order> {
    const userExists = await this.userRepo.existsById(userId);
    if (!userExists) throw new Error(`User ${userId} does not exist`);

    const orgExists = await this.orgRepo.existsById(organizationId);
    if (!orgExists)
      throw new Error(`Organization ${organizationId} does not exist`);

    const order = new Order(
      crypto.randomUUID(),
      new Date(),
      totalAmount,
      userId,
      organizationId,
    );

    return this.orderRepo.create(order);
  }
}
