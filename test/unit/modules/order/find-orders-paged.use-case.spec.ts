import { FindOrdersPagedUseCase } from "@modules/order/application/use-cases/find-orders-paged.use-case";
import { OrderRepositoryMock } from "@test/unit/mocks/order-repository.mock";
import { OrderBuilder } from "@test/unit/builders/order.builder";
import { UserBuilder } from "@test/unit/builders/user.builder";
import { OrganizationBuilder } from "@test/unit/builders/organization.builder";
import { BadRequestError } from "@shared/errors/bad-request.error";
import { Order } from "@modules/order/domain/entities/order.entity";
import { User } from "@modules/user/domain/entities/user.entity";
import { Organization } from "@modules/organization/domain/entities/organization.entity";

describe("FindOrdersPagedUseCase", () => {
  const setupRepo = () => {
    const org: Organization = new OrganizationBuilder().withId("org-1").build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(org.id)
      .build();
    const repo = new OrderRepositoryMock([user], [org]);
    return { repo, org, user };
  };

  it("returns first page with defaults (page=1, pageSize=20, sort=orderDate asc) and proper meta", async () => {
    const { repo, org, user } = setupRepo();

    const o1: Order = new OrderBuilder()
      .withId("o-1")
      .withUserId(user.id)
      .withOrganizationId(org.id)
      .withOrderDate(new Date("2020-01-01T00:00:00.000Z"))
      .build();

    const o2: Order = new OrderBuilder()
      .withId("o-2")
      .withUserId(user.id)
      .withOrganizationId(org.id)
      .withOrderDate(new Date("2020-01-02T00:00:00.000Z"))
      .build();

    const o3: Order = new OrderBuilder()
      .withId("o-3")
      .withUserId(user.id)
      .withOrganizationId(org.id)
      .withOrderDate(new Date("2020-01-03T00:00:00.000Z"))
      .build();
    repo.seed([o3, o1, o2]);

    const useCase = new FindOrdersPagedUseCase(repo);

    const result = await useCase.execute({
      field: "orderDate",
      direction: "asc",
    });

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
    expect(result.totalItems).toBe(3);
    expect(result.totalPages).toBe(1);

    expect(result.items.map((o) => o.id)).toEqual(["o-1", "o-2", "o-3"]);
  });

  it("supports sortDir=desc", async () => {
    const { repo, org, user } = setupRepo();

    const older: Order = new OrderBuilder()
      .withId("o-1")
      .withUserId(user.id)
      .withOrganizationId(org.id)
      .withOrderDate(new Date("2020-01-01T00:00:00.000Z"))
      .build();

    const newer: Order = new OrderBuilder()
      .withId("o-2")
      .withUserId(user.id)
      .withOrganizationId(org.id)
      .withOrderDate(new Date("2020-01-02T00:00:00.000Z"))
      .build();

    repo.seed([older, newer]);

    const useCase = new FindOrdersPagedUseCase(repo);

    const result = await useCase.execute({
      field: "orderDate",
      direction: "desc",
      page: 1,
      pageSize: 10,
    });

    expect(result.items.map((o) => o.id)).toEqual(["o-2", "o-1"]);
  });

  it("paginates: page=2 returns next slice and computes totalPages", async () => {
    const { repo, org, user } = setupRepo();

    const o1: Order = new OrderBuilder()
      .withId("o-1")
      .withUserId(user.id)
      .withOrganizationId(org.id)
      .withOrderDate(new Date("2020-01-01T00:00:00.000Z"))
      .build();

    const o2: Order = new OrderBuilder()
      .withId("o-2")
      .withUserId(user.id)
      .withOrganizationId(org.id)
      .withOrderDate(new Date("2020-01-02T00:00:00.000Z"))
      .build();

    const o3: Order = new OrderBuilder()
      .withId("o-3")
      .withUserId(user.id)
      .withOrganizationId(org.id)
      .withOrderDate(new Date("2020-01-03T00:00:00.000Z"))
      .build();

    repo.seed([o1, o2, o3]);

    const useCase = new FindOrdersPagedUseCase(repo);

    const result = await useCase.execute({
      page: 2,
      pageSize: 2,
      field: "orderDate",
      direction: "asc",
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("o-3");

    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(2);
    expect(result.totalItems).toBe(3);
    expect(result.totalPages).toBe(2);
  });

  it("clamps page and pageSize (page<1 -> 1, pageSize>200 -> 200)", async () => {
    const { repo } = setupRepo();
    repo.seed([]);

    const useCase = new FindOrdersPagedUseCase(repo);

    const result = await useCase.execute({
      page: 0,
      pageSize: 999,
      field: "orderDate",
      direction: "asc",
    });

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(200);
    expect(result.items).toEqual([]);
    expect(result.totalItems).toBe(0);
    expect(result.totalPages).toBe(1);
  });

  it("throws BadRequestError for unsupported sortBy (field)", async () => {
    const { repo } = setupRepo();
    repo.seed([]);

    const useCase = new FindOrdersPagedUseCase(repo);

    await expect(
      useCase.execute({
        field: "email" as unknown as "orderDate",
        direction: "asc",
      }),
    ).rejects.toThrow(
      new BadRequestError("Unsupported sortBy: email", {
        allowed: ["orderDate"],
      }),
    );
  });

  it("throws BadRequestError for unsupported sortDir (direction)", async () => {
    const { repo } = setupRepo();
    repo.seed([]);

    const useCase = new FindOrdersPagedUseCase(repo);

    await expect(
      useCase.execute({
        field: "orderDate",
        direction: "xxx" as unknown as "asc",
      }),
    ).rejects.toThrow(
      new BadRequestError("Unsupported sortDir: xxx", {
        allowed: ["asc", "desc"],
      }),
    );
  });

  it("calls repository findPaged with expected offset/limit/orderBy", async () => {
    class OrderRepositorySpy extends OrderRepositoryMock {
      public lastQuery: {
        offset: number;
        limit: number;
        orderBy: { field: "orderDate"; direction: "asc" | "desc" };
      } | null = null;

      override async findPaged<F extends string>(query: {
        offset: number;
        limit: number;
        orderBy: { field: F; direction: "asc" | "desc" };
      }): Promise<{ rows: Order[]; total: number }> {
        this.lastQuery = {
          offset: query.offset,
          limit: query.limit,
          orderBy: {
            field: query.orderBy.field as unknown as "orderDate",
            direction: query.orderBy.direction,
          },
        };
        return super.findPaged(query);
      }
    }

    const org: Organization = new OrganizationBuilder().withId("org-1").build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(org.id)
      .build();
    const repo = new OrderRepositorySpy([user], [org]);
    repo.seed([
      new OrderBuilder()
        .withId("o-1")
        .withUserId(user.id)
        .withOrganizationId(org.id)
        .build(),
    ]);

    const useCase = new FindOrdersPagedUseCase(repo);

    await useCase.execute({
      page: 3,
      pageSize: 5,
      field: "orderDate",
      direction: "desc",
    });

    expect(repo.lastQuery).toEqual({
      offset: 10,
      limit: 5,
      orderBy: { field: "orderDate", direction: "desc" },
    });
  });

  it("returns empty items and totalPages=1 when repository has no rows", async () => {
    const { repo } = setupRepo();
    repo.seed([]);

    const useCase = new FindOrdersPagedUseCase(repo);

    const result = await useCase.execute({
      page: 1,
      pageSize: 20,
      field: "orderDate",
      direction: "asc",
    });

    expect(result.items).toEqual([]);
    expect(result.totalItems).toBe(0);
    expect(result.totalPages).toBe(1);
  });
});
