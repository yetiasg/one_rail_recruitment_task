import { DeleteOrderUseCase } from "@modules/order/application/use-cases/delete-order.use-case";
import { OrderRepositoryMock } from "@test/unit/mocks/order-repository.mock";
import { OrderBuilder } from "@test/unit/builders/order.builder";
import { UserBuilder } from "@test/unit/builders/user.builder";
import { OrganizationBuilder } from "@test/unit/builders/organization.builder";
import { NotFoundError } from "@shared/errors/not-found.error";
import { Order } from "@modules/order/domain/entities/order.entity";
import { User } from "@modules/user/domain/entities/user.entity";
import { Organization } from "@modules/organization/domain/entities/organization.entity";

describe("DeleteOrderUseCase", () => {
  it("deletes order and returns the deleted entity", async () => {
    const org: Organization = new OrganizationBuilder().withId("org-1").build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(org.id)
      .build();

    const repo = new OrderRepositoryMock([user], [org]);

    const order: Order = new OrderBuilder()
      .withId("o-1")
      .withUserId(user.id)
      .withOrganizationId(org.id)
      .withOrderDate(new Date("2020-01-01T12:00:00.000Z"))
      .withTotalAmount(100)
      .build();

    repo.seed([order]);

    const useCase = new DeleteOrderUseCase(repo);
    const result = await useCase.execute(order.id);

    expect(result).toEqual(order);

    const after = await repo.findById(order.id);
    expect(after).toBeNull();
  });

  it("throws NotFoundError when order does not exist", async () => {
    const org: Organization = new OrganizationBuilder().withId("org-1").build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(org.id)
      .build();

    const repo = new OrderRepositoryMock([user], [org]);
    repo.seed([]);

    const useCase = new DeleteOrderUseCase(repo);

    await expect(useCase.execute("missing-order")).rejects.toThrow(
      new NotFoundError("Order not found"),
    );
  });

  it("does not call delete when order is not found (short-circuit)", async () => {
    class OrderRepositorySpy extends OrderRepositoryMock {
      public deleteCalls: Array<Order["id"]> = [];

      override async delete(id: Order["id"]): Promise<boolean> {
        this.deleteCalls.push(id);
        return super.delete(id);
      }
    }

    const org: Organization = new OrganizationBuilder().withId("org-1").build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(org.id)
      .build();

    const repo = new OrderRepositorySpy([user], [org]);
    repo.seed([]);

    const useCase = new DeleteOrderUseCase(repo);

    await expect(useCase.execute("missing-order")).rejects.toThrow(
      new NotFoundError("Order not found"),
    );

    expect(repo.deleteCalls).toEqual([]);
  });
});
