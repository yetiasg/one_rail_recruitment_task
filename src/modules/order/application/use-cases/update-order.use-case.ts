import { Injectable } from "@kernel/di/injectable.decorator";
import { Order } from "@modules/order/domain/entities/order.entity";
import { OrderRepositoryPort } from "@modules/order/domain/ports/order-repository.port";
import { NotFoundError } from "@shared/errors/not-found.error";

export interface UpdateOrderInput {
  totalAmount: Order["totalAmount"];
}

@Injectable()
export class UpdateOrderUseCase {
  constructor(private readonly orderRepo: OrderRepositoryPort) {}

  async execute(id: Order["id"], data: UpdateOrderInput): Promise<Order> {
    const orderExists = await this.orderRepo.findById(id);
    if (!orderExists) throw new NotFoundError("Order not found");
    return this.orderRepo.update({ ...orderExists, ...data });
  }
}
