import { Order } from "@modules/order/domain/entities/order.entity";
import { OrderRepositoryPort } from "../ports/order-repository.port";
import {
  clampInt,
  OrderBy,
  PagedResult,
  PaginationQuery,
} from "@shared/application/pagination/pagination.type";
import { BadRequestException } from "@kernel/http/http-exceptions";
import { Injectable } from "@kernel/di/injectable.decorator";

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
      throw new BadRequestException(`Unsupported sortBy: ${String(sortBy)}`, {
        allowed: ["email"],
      });

    if (sortDir !== "asc" && sortDir !== "desc")
      throw new BadRequestException(`Unsupported sortDir: ${String(sortDir)}`, {
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
