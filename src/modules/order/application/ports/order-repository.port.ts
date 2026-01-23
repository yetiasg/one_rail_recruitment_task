import { Order } from "@modules/order/domain/entities/order.entity";
import {
  FindPagedRepoQuery,
  FindPagedRepoResult,
} from "@shared/application/pagination/pagination.type";

export interface OrderWithRelations {
  order: Order;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    organizationId: string;
    dateCreated: Date;
  };
  organization: {
    id: string;
    name: string;
    industry: string;
    dateFounded: Date;
  };
}

export abstract class OrderRepositoryPort {
  /**
   * For GET /api/orders/{id}: returns order + associated user + organization
   */
  abstract findByIdWithUserAndOrganization(
    id: string,
  ): Promise<OrderWithRelations | null>;

  abstract existsById(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<Order | null>;
  abstract findPaged<F extends string>(
    query: FindPagedRepoQuery<F>,
  ): Promise<FindPagedRepoResult<Order>>;
  /**
   * Must ensure userId and organizationId exist (DB FK will enforce).
   * We also typically verify in use-case before calling this.
   */
  abstract create(data: Omit<Order, "id">): Promise<Order>;
  abstract update(order: Order): Promise<Order>;
  abstract delete(id: Order["id"]): Promise<boolean>;
}
