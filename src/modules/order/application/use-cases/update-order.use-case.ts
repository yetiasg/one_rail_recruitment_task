import { Injectable } from "@kernel/di/injectable.decorator";
import { OrderRepositoryPort } from "../ports/order-repository.port";
import { Order } from "@modules/order/domain/entities/order.entity";
import { NotFoundException } from "@kernel/http/http-exceptions";

export interface UpdateOrderInput {
  totalAmount: Order["totalAmount"];
}

@Injectable()
export class UpdateOrderUseCase {
  constructor(private readonly orderRepo: OrderRepositoryPort) {}

  async execute(id: Order["id"], data: UpdateOrderInput): Promise<Order> {
    const orderExists = await this.orderRepo.findById(id);
    if (!orderExists) throw new NotFoundException("Order not found");
    return this.orderRepo.update({ ...orderExists, ...data });
  }
}
