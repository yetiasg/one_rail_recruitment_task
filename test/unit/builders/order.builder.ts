import { Order } from "@modules/order/domain/entities/order.entity";

export class OrderBuilder {
  private id = crypto.randomUUID() as string;
  private orderDate = new Date("2020-01-01T12:00:00.000Z");
  private totalAmount = 100.0;
  private userId = crypto.randomUUID() as string;
  private organizationId = crypto.randomUUID() as string;

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withOrderDate(orderDate: Date): this {
    this.orderDate = orderDate;
    return this;
  }

  withTotalAmount(totalAmount: number): this {
    this.totalAmount = totalAmount;
    return this;
  }

  withUserId(userId: string): this {
    this.userId = userId;
    return this;
  }

  withOrganizationId(organizationId: string): this {
    this.organizationId = organizationId;
    return this;
  }

  build(): Order {
    return new Order(
      this.id,
      this.orderDate,
      this.totalAmount,
      this.userId,
      this.organizationId,
    );
  }
}
