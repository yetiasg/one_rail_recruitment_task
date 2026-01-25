import { Injectable } from "@kernel/di/injectable.decorator";
import { Order } from "@modules/order/domain/entities/order.entity";
import { OrderRepositoryPort } from "@modules/order/domain/ports/order-repository.port";
import { NotFoundError } from "@shared/errors/not-found.error";

@Injectable()
export class DeleteOrderUseCase {
  constructor(private readonly orderRepo: OrderRepositoryPort) {}

  async execute(id: Order["id"]): Promise<Order> {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new NotFoundError("Order not found");
    await this.orderRepo.delete(id);
    return order;
  }
}
