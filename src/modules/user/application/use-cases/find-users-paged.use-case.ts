import { Injectable } from "@kernel/di/injectable.decorator";
import {
  clampInt,
  OrderBy,
  PagedResult,
  PaginationQuery,
} from "@shared/pagination/pagination.type";
import { User } from "@modules/user/domain/entities/user.entity";
import { UserRepositoryPort } from "@modules/user/domain/ports/user-repository.port";
import { BadRequestError } from "@shared/errors/bad-request.error";

export interface FindUsersQuery extends OrderBy<"email">, PaginationQuery {}

@Injectable()
export class FindUsersPagedUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(input: FindUsersQuery): Promise<PagedResult<User>> {
    const page = clampInt(input.page ?? 1, 1, 1_000_000);
    const pageSize = clampInt(input.pageSize ?? 20, 1, 200);
    const sortBy = input.field ?? "email";
    const sortDir = input.direction ?? "asc";

    if (sortBy !== "email")
      throw new BadRequestError(`Unsupported sortBy: ${String(sortBy)}`, {
        allowed: ["email"],
      });

    if (sortDir !== "asc" && sortDir !== "desc")
      throw new BadRequestError(`Unsupported sortDir: ${String(sortDir)}`, {
        allowed: ["asc", "desc"],
      });

    const offset = (page - 1) * pageSize;

    const { rows, total } = await this.userRepo.findPaged({
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
