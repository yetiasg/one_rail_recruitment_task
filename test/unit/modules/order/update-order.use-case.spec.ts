import { UpdateOrderUseCase } from "@modules/order/application/use-cases/update-order.use-case";
import { OrderRepositoryMock } from "@test/unit/mocks/order-repository.mock";
import { OrderBuilder } from "@test/unit/builders/order.builder";
import { UserBuilder } from "@test/unit/builders/user.builder";
import { OrganizationBuilder } from "@test/unit/builders/organization.builder";
import { NotFoundError } from "@shared/errors/not-found.error";
import { Order } from "@modules/order/domain/entities/order.entity";
import { User } from "@modules/user/domain/entities/user.entity";
import { Organization } from "@modules/organization/domain/entities/organization.entity";

describe("UpdateOrderUseCase", () => {
  it("updates order totalAmount and returns updated entity", async () => {
    const org: Organization = new OrganizationBuilder().withId("org-1").build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(org.id)
      .build();

    const repo = new OrderRepositoryMock([user], [org]);

    const existing: Order = new OrderBuilder()
      .withId("o-1")
      .withUserId(user.id)
      .withOrganizationId(org.id)
      .withOrderDate(new Date("2020-01-01T12:00:00.000Z"))
      .withTotalAmount(100)
      .build();

    repo.seed([existing]);

    const useCase = new UpdateOrderUseCase(repo);
    const result = await useCase.execute(existing.id, { totalAmount: 250.5 });

    expect(result.id).toBe(existing.id);
    expect(result.userId).toBe(existing.userId);
    expect(result.organizationId).toBe(existing.organizationId);
    expect(result.orderDate).toEqual(existing.orderDate);

    expect(result.totalAmount).toBe(250.5);
  });

  it("throws NotFoundError when order does not exist", async () => {
    const org: Organization = new OrganizationBuilder().withId("org-1").build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(org.id)
      .build();

    const repo = new OrderRepositoryMock([user], [org]);
    repo.seed([]);

    const useCase = new UpdateOrderUseCase(repo);

    await expect(
      useCase.execute("missing-order", { totalAmount: 10 }),
    ).rejects.toThrow(new NotFoundError("Order not found"));
  });

  it("calls repository update with merged entity (keeps non-updated fields intact)", async () => {
    class OrderRepositorySpy extends OrderRepositoryMock {
      public updateCalls: Order[] = [];

      override async update(order: Order): Promise<Order> {
        this.updateCalls.push(order);
        return super.update(order);
      }
    }

    const org: Organization = new OrganizationBuilder().withId("org-1").build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(org.id)
      .build();

    const repo = new OrderRepositorySpy([user], [org]);

    const existing: Order = new OrderBuilder()
      .withId("o-1")
      .withUserId(user.id)
      .withOrganizationId(org.id)
      .withOrderDate(new Date("2020-01-01T12:00:00.000Z"))
      .withTotalAmount(100)
      .build();

    repo.seed([existing]);

    const useCase = new UpdateOrderUseCase(repo);

    await useCase.execute(existing.id, { totalAmount: 999 });

    expect(repo.updateCalls).toHaveLength(1);

    const payload = repo.updateCalls[0];
    expect(payload.id).toBe(existing.id);
    expect(payload.userId).toBe(existing.userId);
    expect(payload.organizationId).toBe(existing.organizationId);
    expect(payload.orderDate).toEqual(existing.orderDate);
    expect(payload.totalAmount).toBe(999);
  });

  it("does not call update when order is not found (short-circuit)", async () => {
    class OrderRepositorySpy extends OrderRepositoryMock {
      public updateCalls: Order[] = [];

      override async update(order: Order): Promise<Order> {
        this.updateCalls.push(order);
        return super.update(order);
      }
    }

    const org: Organization = new OrganizationBuilder().withId("org-1").build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(org.id)
      .build();

    const repo = new OrderRepositorySpy([user], [org]);
    repo.seed([]);

    const useCase = new UpdateOrderUseCase(repo);

    await expect(
      useCase.execute("missing-order", { totalAmount: 1 }),
    ).rejects.toThrow(new NotFoundError("Order not found"));

    expect(repo.updateCalls).toHaveLength(0);
  });
});
