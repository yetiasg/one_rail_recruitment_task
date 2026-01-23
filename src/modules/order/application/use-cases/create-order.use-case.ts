import { Injectable } from "@kernel/di/injectable.decorator";
import { UserRepositoryPort } from "@modules/user/application/ports/user-repository.port";
import { OrderRepositoryPort } from "../ports/order-repository.port";
import { Order } from "@modules/order/domain/entities/order.entity";

export interface CreateOrderInput {
  userId: string;
  totalAmount: number;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly orderRepo: OrderRepositoryPort,
  ) {}

  async execute({ userId, totalAmount }: CreateOrderInput): Promise<Order> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error(`User ${userId} does not exist`);

    const order = new Order(
      crypto.randomUUID(),
      new Date(),
      totalAmount,
      userId,
      user.organizationId,
    );

    return this.orderRepo.create(order);
  }
}
