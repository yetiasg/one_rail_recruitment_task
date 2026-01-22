import { OrderModel } from "../models/order.model";
import { Order } from "@modules/order/domain/entities/order.entity";

export class OrderPersistenceMapper {
  static toDomain(row: OrderModel): Order {
    return new Order(
      row.id,
      row.orderDate,
      row.totalAmount,
      row.userId,
      row.organizationId,
    );
  }
}
