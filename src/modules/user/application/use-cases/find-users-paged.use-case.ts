import { Injectable } from "@kernel/di/injectable.decorator";
import { UserRepositoryPort } from "../ports/user-repository.port";
import { BadRequestException } from "@kernel/http/http-exceptions";
import {
  clampInt,
  OrderBy,
  PagedResult,
  PaginationQuery,
} from "@shared/application/pagination/pagination.type";
import { User } from "@modules/user/domain/entities/user.entity";

export interface FindUsersQuery extends OrderBy<"email">, PaginationQuery {}

@Injectable()
export class FindUsersPagedUseCase {
  constructor(
    private readonly userRepo: Pick<UserRepositoryPort, "findPaged">,
  ) {}

  async execute(input: FindUsersQuery): Promise<PagedResult<User>> {
    const page = clampInt(input.page ?? 1, 1, 1_000_000);
    const pageSize = clampInt(input.pageSize ?? 20, 1, 200);
    const sortBy = input.field ?? "email";
    const sortDir = input.direction ?? "asc";

    if (sortBy !== "email")
      throw new BadRequestException(`Unsupported sortBy: ${String(sortBy)}`, {
        allowed: ["email"],
      });

    if (sortDir !== "asc" && sortDir !== "desc")
      throw new BadRequestException(`Unsupported sortDir: ${String(sortDir)}`, {
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
