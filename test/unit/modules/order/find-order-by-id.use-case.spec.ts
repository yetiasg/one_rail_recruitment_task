import { FindOrderByIdUseCase } from "@modules/order/application/use-cases/find-order-by-id.use-case";
import { OrderRepositoryMock } from "@test/unit/mocks/order-repository.mock";
import { OrderBuilder } from "@test/unit/builders/order.builder";
import { UserBuilder } from "@test/unit/builders/user.builder";
import { OrganizationBuilder } from "@test/unit/builders/organization.builder";
import { NotFoundError } from "@shared/errors/not-found.error";
import { OrderWithRelations } from "@modules/order/domain/ports/order-repository.port";
import { User } from "@modules/user/domain/entities/user.entity";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { Order } from "@modules/order/domain/entities/order.entity";

describe("FindOrderByIdUseCase", () => {
  it("returns OrderWithRelations (plain user/org objects) when found", async () => {
    const organization: Organization = new OrganizationBuilder()
      .withId("org-1")
      .withName("Acme")
      .withIndustry("SaaS")
      .withDateFounded(new Date("2015-01-01T00:00:00.000Z"))
      .build();

    const user: User = new UserBuilder()
      .withId("u-1")
      .withEmail("u@x.com")
      .withOrganizationId(organization.id)
      .build();

    const repo = new OrderRepositoryMock([user], [organization]);

    const order: Order = new OrderBuilder()
      .withId("o-1")
      .withUserId(user.id)
      .withOrganizationId(organization.id)
      .withOrderDate(new Date("2020-01-01T12:00:00.000Z"))
      .withTotalAmount(123.45)
      .build();

    repo.seed([order]);

    const useCase = new FindOrderByIdUseCase(repo);

    const result = await useCase.execute(order.id);

    const expected: OrderWithRelations = {
      ...order,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organizationId: user.organizationId,
        dateCreated: user.dateCreated,
      },
      organization: {
        id: organization.id,
        name: organization.name,
        industry: organization.industry,
        dateFounded: organization.dateFounded,
      },
    };

    expect(result).toEqual(expected);

    expect(result.user.email).toBe(user.email);
    expect(result.organization.name).toBe(organization.name);
  });

  it("throws NotFoundError when order does not exist", async () => {
    const organization: Organization = new OrganizationBuilder()
      .withId("org-1")
      .build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(organization.id)
      .build();

    const repo = new OrderRepositoryMock([user], [organization]);
    repo.seed([]);

    const useCase = new FindOrderByIdUseCase(repo);

    await expect(useCase.execute("missing-order")).rejects.toThrow(
      new NotFoundError("Order not found"),
    );
  });

  it("calls repository findByIdWithUserAndOrganization with provided id", async () => {
    class OrderRepositorySpy extends OrderRepositoryMock {
      public calls: Array<Order["id"]> = [];

      override async findByIdWithUserAndOrganization(
        id: string,
      ): Promise<OrderWithRelations | null> {
        this.calls.push(id);
        return super.findByIdWithUserAndOrganization(id);
      }
    }

    const organization: Organization = new OrganizationBuilder()
      .withId("org-1")
      .build();
    const user: User = new UserBuilder()
      .withId("u-1")
      .withOrganizationId(organization.id)
      .build();

    const repo = new OrderRepositorySpy([user], [organization]);

    const order: Order = new OrderBuilder()
      .withId("o-1")
      .withUserId(user.id)
      .withOrganizationId(organization.id)
      .build();

    repo.seed([order]);

    const useCase = new FindOrderByIdUseCase(repo);

    await useCase.execute(order.id);

    expect(repo.calls).toEqual([order.id]);
  });
});
