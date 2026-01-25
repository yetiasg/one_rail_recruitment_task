import { Injectable } from "@kernel/di/injectable.decorator";
import { clampInt, PagedResult } from "@shared/pagination/pagination.type";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { OrganizationRepositoryPort } from "@modules/organization/domain/ports/organization-repository.port";
import { BadRequestError } from "@shared/errors/bad-request.error";

export interface FindOrganizationsQuery {
  page?: number;
  pageSize?: number;
  sortDir?: "asc" | "desc";
}

@Injectable()
export class FindOrganizationsPagedUseCase {
  constructor(private readonly orgRepo: OrganizationRepositoryPort) {}

  async execute(
    raw: FindOrganizationsQuery,
  ): Promise<PagedResult<Organization>> {
    const page = clampInt(raw.page ?? 1, 1, 1_000_000);
    const pageSize = clampInt(raw.pageSize ?? 20, 1, 200);

    const sortDir = raw.sortDir ?? "asc";
    if (sortDir !== "asc" && sortDir !== "desc") {
      throw new BadRequestError(`Unsupported sortDir: ${String(sortDir)}`, {
        allowed: ["asc", "desc"],
      });
    }

    const offset = (page - 1) * pageSize;

    const { rows, total } = await this.orgRepo.findPaged({
      offset,
      limit: pageSize,
      orderBy: { field: "name", direction: sortDir },
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
