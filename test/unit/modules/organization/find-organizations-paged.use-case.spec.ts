import { FindOrganizationsPagedUseCase } from "@modules/organization/application/use-cases/find-organizations-paged.use-case";
import { OrganizationRepositoryMock } from "@test/unit/mocks/organization-repository.mock";
import { OrganizationBuilder } from "@test/unit/builders/organization.builder";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { BadRequestError } from "@shared/errors/bad-request.error";

describe("FindOrganizationsPagedUseCase", () => {
  it("returns first page with defaults (page=1, pageSize=20, sortDir=asc) and proper meta", async () => {
    const repo = new OrganizationRepositoryMock();

    const org1: Organization = new OrganizationBuilder()
      .withId("1")
      .withDateFounded(new Date("2010-01-01T00:00:00.000Z"))
      .build();
    const org2: Organization = new OrganizationBuilder()
      .withId("2")
      .withDateFounded(new Date("2012-01-01T00:00:00.000Z"))
      .build();
    const org3: Organization = new OrganizationBuilder()
      .withId("3")
      .withDateFounded(new Date("2014-01-01T00:00:00.000Z"))
      .build();
    repo.seed([org1, org2, org3]);

    const useCase = new FindOrganizationsPagedUseCase(repo);
    const result = await useCase.execute({});

    expect(result.items).toHaveLength(3);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
    expect(result.totalItems).toBe(3);
    expect(result.totalPages).toBe(1);
  });

  it("supports sortDir=desc", async () => {
    const repo = new OrganizationRepositoryMock();

    const older: Organization = new OrganizationBuilder()
      .withId("1")
      .withDateFounded(new Date("2010-01-01T00:00:00.000Z"))
      .build();
    const newer: Organization = new OrganizationBuilder()
      .withId("2")
      .withDateFounded(new Date("2020-01-01T00:00:00.000Z"))
      .build();
    repo.seed([older, newer]);

    const useCase = new FindOrganizationsPagedUseCase(repo);
    const result = await useCase.execute({ sortDir: "desc", pageSize: 10 });

    expect(result.items.map((o) => o.id)).toEqual(["2", "1"]);
  });

  it("paginates: page=2 returns next slice and computes totalPages", async () => {
    const repo = new OrganizationRepositoryMock();

    const org1: Organization = new OrganizationBuilder()
      .withId("1")
      .withDateFounded(new Date("2010-01-01T00:00:00.000Z"))
      .build();
    const org2: Organization = new OrganizationBuilder()
      .withId("2")
      .withDateFounded(new Date("2012-01-01T00:00:00.000Z"))
      .build();
    const org3: Organization = new OrganizationBuilder()
      .withId("3")
      .withDateFounded(new Date("2014-01-01T00:00:00.000Z"))
      .build();
    repo.seed([org1, org2, org3]);

    const useCase = new FindOrganizationsPagedUseCase(repo);
    const result = await useCase.execute({
      page: 2,
      pageSize: 2,
      sortDir: "asc",
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("3");

    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(2);
    expect(result.totalItems).toBe(3);
    expect(result.totalPages).toBe(2);
  });

  it("clamps page and pageSize (page<1 -> 1, pageSize>200 -> 200)", async () => {
    const repo = new OrganizationRepositoryMock();
    repo.seed([]);

    const useCase = new FindOrganizationsPagedUseCase(repo);
    const result = await useCase.execute({
      page: 0,
      pageSize: 999,
      sortDir: "asc",
    });

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(200);
    expect(result.items).toEqual([]);
    expect(result.totalItems).toBe(0);
    expect(result.totalPages).toBe(1);
  });

  it("throws BadRequestError for unsupported sortDir", async () => {
    const repo = new OrganizationRepositoryMock();
    repo.seed([]);

    const useCase = new FindOrganizationsPagedUseCase(repo);

    await expect(
      useCase.execute({ sortDir: "xxx" as unknown as "asc" }),
    ).rejects.toThrow(
      new BadRequestError(`Unsupported sortDir: xxx`, {
        allowed: ["asc", "desc"],
      }),
    );
  });

  it("calls repository findPaged with expected offset/limit/orderBy", async () => {
    class OrganizationRepositorySpy extends OrganizationRepositoryMock {
      public lastQuery: {
        offset: number;
        limit: number;
        orderBy: { field: string; direction: "asc" | "desc" };
      } | null = null;

      override async findPaged<F extends string>(query: {
        offset: number;
        limit: number;
        orderBy: { field: F; direction: "asc" | "desc" };
      }): Promise<{ rows: Organization[]; total: number }> {
        this.lastQuery = {
          offset: query.offset,
          limit: query.limit,
          orderBy: {
            field: String(query.orderBy.field),
            direction: query.orderBy.direction,
          },
        };
        return super.findPaged(query);
      }
    }

    const repo = new OrganizationRepositorySpy();
    repo.seed([new OrganizationBuilder().withId("1").build()]);

    const useCase = new FindOrganizationsPagedUseCase(repo);
    await useCase.execute({ page: 3, pageSize: 5, sortDir: "desc" });

    expect(repo.lastQuery).toEqual({
      offset: 10, // (3-1)*5
      limit: 5,
      orderBy: { field: "name", direction: "desc" },
    });
  });

  it("returns empty items and totalPages=1 when repository has no rows", async () => {
    const repo = new OrganizationRepositoryMock();
    repo.seed([]);

    const useCase = new FindOrganizationsPagedUseCase(repo);
    const result = await useCase.execute({
      page: 1,
      pageSize: 20,
      sortDir: "asc",
    });

    expect(result.items).toEqual([]);
    expect(result.totalItems).toBe(0);
    expect(result.totalPages).toBe(1);
  });
});
