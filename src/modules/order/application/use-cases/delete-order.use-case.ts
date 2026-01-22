import { Injectable } from "@kernel/di/injectable.decorator";
import { OrderRepositoryPort } from "../ports/order-repository.port";
import { Order } from "@modules/order/domain/entities/order.entity";
import { NotFoundException } from "@kernel/http/http-exceptions";

@Injectable()
export class DeleteOrderUseCase {
  constructor(private readonly orderRepo: OrderRepositoryPort) {}

  async execute(id: Order["id"]): Promise<Order> {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new NotFoundException("Order not found");
    await this.orderRepo.delete(id);
    return order;
  }
}
