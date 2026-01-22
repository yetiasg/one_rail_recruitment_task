import { Injectable } from "@kernel/di/injectable.decorator";
import {
  OrderRepositoryPort,
  OrderWithRelations,
} from "../ports/order-repository.port";
import { Order } from "@modules/order/domain/entities/order.entity";
import { NotFoundException } from "@kernel/http/http-exceptions";

@Injectable()
export class FindOrderByIdUseCase {
  constructor(private readonly orderRepo: OrderRepositoryPort) {}

  async execute(id: Order["id"]): Promise<OrderWithRelations> {
    const order = await this.orderRepo.findByIdWithUserAndOrganization(id);
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }
}
