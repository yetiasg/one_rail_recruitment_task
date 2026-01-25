import { Injectable } from "@kernel/di/injectable.decorator";
import { Order } from "@modules/order/domain/entities/order.entity";
import { OrderRepositoryPort } from "@modules/order/domain/ports/order-repository.port";
import { UserRepositoryPort } from "@modules/user/domain/ports/user-repository.port";
import { NotFoundError } from "@shared/errors/not-found.error";

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
    if (!user) throw new NotFoundError(`User ${userId} does not exist`);

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
