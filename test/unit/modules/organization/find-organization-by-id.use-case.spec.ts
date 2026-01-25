import { FindOrganizationByIdUseCase } from "@modules/organization/application/use-cases/find-organization-by-id.use-case";
import { OrganizationRepositoryMock } from "@test/unit/mocks/organization-repository.mock";
import { OrganizationBuilder } from "@test/unit/builders/organization.builder";
import { NotFoundError } from "@shared/errors/not-found.error";
import { Organization } from "@modules/organization/domain/entities/organization.entity";

describe("FindOrganizationByIdUseCase", () => {
  it("returns organization when found", async () => {
    const repo = new OrganizationRepositoryMock();

    const organization: Organization = new OrganizationBuilder()
      .withId("org-1")
      .withName("Acme Sp. z o.o.")
      .withIndustry("SaaS")
      .withDateFounded(new Date("2015-01-01T00:00:00.000Z"))
      .build();
    repo.seed([organization]);

    const useCase = new FindOrganizationByIdUseCase(repo);
    const result = await useCase.execute(organization.id);

    expect(result).toEqual(organization);
  });

  it("throws NotFoundError when organization does not exist", async () => {
    const repo = new OrganizationRepositoryMock();
    repo.seed([]);

    const useCase = new FindOrganizationByIdUseCase(repo);

    await expect(useCase.execute("missing-org")).rejects.toThrow(
      new NotFoundError("Organization not found"),
    );
  });

  it("calls repository findById with the provided id", async () => {
    class OrganizationRepositorySpy extends OrganizationRepositoryMock {
      public findByIdCalls: Array<Organization["id"]> = [];

      override async findById(
        id: Organization["id"],
      ): Promise<Organization | null> {
        this.findByIdCalls.push(id);
        return super.findById(id);
      }
    }

    const repo = new OrganizationRepositorySpy();

    const organization: Organization = new OrganizationBuilder()
      .withId("org-1")
      .build();
    repo.seed([organization]);

    const useCase = new FindOrganizationByIdUseCase(repo);
    await useCase.execute(organization.id);

    expect(repo.findByIdCalls).toEqual([organization.id]);
  });
});
