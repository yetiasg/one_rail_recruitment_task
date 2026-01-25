/* eslint-disable @typescript-eslint/require-await */

import { Order } from "@modules/order/domain/entities/order.entity";
import {
  OrderRepositoryPort,
  OrderWithRelations,
} from "@modules/order/domain/ports/order-repository.port";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { User } from "@modules/user/domain/entities/user.entity";
import {
  FindPagedRepoQuery,
  FindPagedRepoResult,
} from "@shared/pagination/pagination.type";

export class OrderRepositoryMock implements OrderRepositoryPort {
  private orders: Order[] = [];

  constructor(
    private readonly users: User[],
    private readonly organizations: Organization[],
  ) {}

  seed(orders: Order[]) {
    this.orders = orders;
  }

  async findByIdWithUserAndOrganization(
    id: Order["id"],
  ): Promise<OrderWithRelations | null> {
    const order = this.orders.find((order) => order.id === id);
    if (!order) return null;

    const organization = this.organizations.find(
      (org) => org.id === order.organizationId,
    )!;
    const user = this.users.find((user) => user.id === order.userId)!;

    return { ...order, organization, user };
  }

  async findPaged<F extends string>(
    query: FindPagedRepoQuery<F>,
  ): Promise<FindPagedRepoResult<Order>> {
    const sorted = this.orders.slice().sort((a, b) => {
      const at = a.orderDate.getTime();
      const bt = b.orderDate.getTime();

      const cmp = at === bt ? 0 : at < bt ? -1 : 1;
      return query.orderBy.direction === "asc" ? cmp : -cmp;
    });

    const rows = sorted.slice(query.offset, query.offset + query.limit);
    return { rows, total: this.orders.length };
  }

  async existsById(id: Order["id"]): Promise<boolean> {
    return this.orders.some((order) => order.id === id);
  }

  async findById(id: Order["id"]): Promise<Order | null> {
    const order = this.orders.find((order) => order.id === id);
    if (order) return order;
    return null;
  }

  async create(order: Order): Promise<Order> {
    this.orders.push(order);
    return order;
  }

  async update(order: Order): Promise<Order> {
    const exist = this.orders.find((ord) => ord.id === order.id)!;
    return { ...exist, ...order };
  }

  async delete(id: Order["id"]): Promise<boolean> {
    const filtered = this.orders.filter((order) => order.id !== id);
    this.orders = filtered;
    return true;
  }
}
