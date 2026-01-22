import { Injectable } from "@kernel/di/injectable.decorator";
import { UserRepositoryPort } from "../../ports/user-repository.port";
import { FindUsersQuery } from "./find-users.types";
import { BadRequestException } from "@kernel/http/http-exceptions";

function clampInt(value: number, min: number, max: number): number {
  const v = Math.trunc(value);
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}

@Injectable()
export class FindUsersUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(input: FindUsersQuery) {
    const page = clampInt(input.page ?? 1, 1, 1_000_000);
    const pageSize = clampInt(input.pageSize ?? 20, 1, 200);

    const sortBy = input.sortBy ?? "email";
    const sortDir = input.sortDir ?? "asc";

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
      orderBy: { field: "email", direction: sortDir },
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
