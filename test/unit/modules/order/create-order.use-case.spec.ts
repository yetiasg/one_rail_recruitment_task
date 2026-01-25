import { CreateOrderUseCase } from "@modules/order/application/use-cases/create-order.use-case";
import { OrderRepositoryMock } from "@test/unit/mocks/order-repository.mock";
import { UserRepositoryMock } from "@test/unit/mocks/user-repository.mock";
import { UserBuilder } from "@test/unit/builders/user.builder";
import { OrderBuilder } from "@test/unit/builders/order.builder";
import { NotFoundError } from "@shared/errors/not-found.error";
import { User } from "@modules/user/domain/entities/user.entity";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { OrganizationBuilder } from "@test/unit/builders/organization.builder";
import { Order } from "@modules/order/domain/entities/order.entity";

describe("CreateOrderUseCase", () => {
  it("creates order when user exists, uses user's organizationId, and persists it", async () => {
    const userRepo = new UserRepositoryMock();

    const org: Organization = new OrganizationBuilder()
      .withId("org-1")
      .withName("Acme")
      .withIndustry("SaaS")
      .withDateFounded(new Date("2015-01-01T00:00:00.000Z"))
      .build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withEmail("u@x.com")
      .withOrganizationId(org.id)
      .build();
    userRepo.seed([user]);

    const orderRepo = new OrderRepositoryMock([user], [org]);
    orderRepo.seed([
      new OrderBuilder()
        .withId("o-1")
        .withUserId(user.id)
        .withOrganizationId(org.id)
        .withOrderDate(new Date("2020-01-01T00:00:00.000Z"))
        .withTotalAmount(10)
        .build(),
    ]);

    const useCase = new CreateOrderUseCase(userRepo, orderRepo);

    const result = await useCase.execute({
      userId: user.id,
      totalAmount: 123.45,
    });

    expect(result).toBeDefined();
    expect(result.id).toEqual(expect.any(String));
    expect(result.userId).toBe(user.id);
    expect(result.organizationId).toBe(user.organizationId);
    expect(result.totalAmount).toBe(123.45);
    expect(result.orderDate).toBeInstanceOf(Date);

    const found = await orderRepo.findById(result.id);
    expect(found).not.toBeNull();
    expect(found!.userId).toBe(user.id);
    expect(found!.organizationId).toBe(org.id);
    expect(found!.totalAmount).toBe(123.45);
  });

  it("throws NotFoundError when user does not exist", async () => {
    const userRepo = new UserRepositoryMock();
    userRepo.seed([]);

    const org: Organization = new OrganizationBuilder().withId("org-1").build();

    const orderRepo = new OrderRepositoryMock([], [org]);
    orderRepo.seed([]);

    const useCase = new CreateOrderUseCase(userRepo, orderRepo);
    const userId = "missing-user";

    await expect(useCase.execute({ userId, totalAmount: 50 })).rejects.toThrow(
      new NotFoundError(`User ${userId} does not exist`),
    );
  });

  it("short-circuits: does not create order when user is missing", async () => {
    class OrderRepositorySpy extends OrderRepositoryMock {
      public createCalls: Order[] = [];

      override async create(order: Order): Promise<Order> {
        this.createCalls.push(order);
        return super.create(order);
      }
    }

    const userRepo = new UserRepositoryMock();
    userRepo.seed([]);

    const org: Organization = new OrganizationBuilder().withId("org-1").build();
    const orderRepo = new OrderRepositorySpy([], [org]);
    orderRepo.seed([]);

    const useCase = new CreateOrderUseCase(userRepo, orderRepo);

    const userId = "missing-user";

    await expect(useCase.execute({ userId, totalAmount: 50 })).rejects.toThrow(
      new NotFoundError(`User ${userId} does not exist`),
    );

    expect(orderRepo.createCalls).toHaveLength(0);
  });

  it("returns exactly the entity returned by repository create()", async () => {
    class OrderRepositorySpy extends OrderRepositoryMock {
      override async create(order: Order): Promise<Order> {
        const created = await super.create(order);

        const modified = new Order(
          created.id,
          created.orderDate,
          Number(created.totalAmount.toFixed(2)),
          created.userId,
          created.organizationId,
        );

        return modified;
      }
    }

    const userRepo = new UserRepositoryMock();

    const org: Organization = new OrganizationBuilder().withId("org-1").build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(org.id)
      .build();

    userRepo.seed([user]);

    const orderRepo = new OrderRepositorySpy([user], [org]);
    orderRepo.seed([]);

    const useCase = new CreateOrderUseCase(userRepo, orderRepo);

    const result = await useCase.execute({
      userId: user.id,
      totalAmount: 12.34567,
    });

    expect(result.totalAmount).toBe(12.35);
  });
});
