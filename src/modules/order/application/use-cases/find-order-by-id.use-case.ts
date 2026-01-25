import { Injectable } from "@kernel/di/injectable.decorator";

import { Order } from "@modules/order/domain/entities/order.entity";
import {
  OrderRepositoryPort,
  OrderWithRelations,
} from "@modules/order/domain/ports/order-repository.port";
import { NotFoundError } from "@shared/errors/not-found.error";

@Injectable()
export class FindOrderByIdUseCase {
  constructor(private readonly orderRepo: OrderRepositoryPort) {}

  async execute(id: Order["id"]): Promise<OrderWithRelations> {
    const order = await this.orderRepo.findByIdWithUserAndOrganization(id);
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }
}
