import { Order } from "@modules/order/domain/entities/order.entity";
import {
  FindPagedRepoQuery,
  FindPagedRepoResult,
} from "@shared/application/pagination/pagination.type";

export interface OrderWithRelations extends Order {
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
  abstract findByIdWithUserAndOrganization(
    id: string,
  ): Promise<OrderWithRelations | null>;
  abstract existsById(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<Order | null>;
  abstract findPaged<F extends string>(
    query: FindPagedRepoQuery<F>,
  ): Promise<FindPagedRepoResult<Order>>;
  abstract create(data: Order): Promise<Order>;
  abstract update(order: Order): Promise<Order>;
  abstract delete(id: Order["id"]): Promise<boolean>;
}
