import { Order } from "@modules/order/domain/entities/order.entity";
import {
  clampInt,
  OrderBy,
  PagedResult,
  PaginationQuery,
} from "@shared/pagination/pagination.type";
import { Injectable } from "@kernel/di/injectable.decorator";
import { OrderRepositoryPort } from "@modules/order/domain/ports/order-repository.port";
import { BadRequestError } from "@shared/errors/bad-request.error";

export interface FindOrdersQuery
  extends OrderBy<"orderDate">, PaginationQuery {}

@Injectable()
export class FindOrdersPagedUseCase {
  constructor(private readonly orderRepo: OrderRepositoryPort) {}

  async execute(input: FindOrdersQuery): Promise<PagedResult<Order>> {
    const page = clampInt(input.page ?? 1, 1, 1_000_000);
    const pageSize = clampInt(input.pageSize ?? 20, 1, 200);
    const sortBy: FindOrdersQuery["field"] = input.field ?? "orderDate";
    const sortDir = input.direction ?? "asc";

    if (sortBy !== "orderDate")
      throw new BadRequestError(`Unsupported sortBy: ${String(sortBy)}`, {
        allowed: ["orderDate"],
      });

    if (sortDir !== "asc" && sortDir !== "desc")
      throw new BadRequestError(`Unsupported sortDir: ${String(sortDir)}`, {
        allowed: ["asc", "desc"],
      });

    const offset = (page - 1) * pageSize;

    const { rows, total } = await this.orderRepo.findPaged<
      FindOrdersQuery["field"]
    >({
      offset,
      limit: pageSize,
      orderBy: { field: sortBy, direction: sortDir },
    });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      items: rows,
      page,
      pageSize,
      totalItems: total,
      totalPages,
    };
  }
}
