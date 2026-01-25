import { DeleteOrganizationUseCase } from "@modules/organization/application/use-cases/delete-organization.use-case";
import { OrganizationRepositoryMock } from "@test/unit/mocks/organization-repository.mock";
import { OrganizationBuilder } from "@test/unit/builders/organization.builder";
import { NotFoundError } from "@shared/errors/not-found.error";
import { Organization } from "@modules/organization/domain/entities/organization.entity";

describe("DeleteOrganizationUseCase", () => {
  it("deletes organization and returns the deleted entity", async () => {
    const repo = new OrganizationRepositoryMock();

    const org: Organization = new OrganizationBuilder()
      .withId("org-1")
      .withName("Acme Sp. z o.o.")
      .withIndustry("SaaS")
      .withDateFounded(new Date("2015-01-01T00:00:00.000Z"))
      .build();
    repo.seed([org]);

    const useCase = new DeleteOrganizationUseCase(repo);
    const result = await useCase.execute(org.id);

    expect(result).toEqual(org);

    const after = await repo.findById(org.id);
    expect(after).toBeNull();
  });

  it("throws NotFoundError when organization does not exist", async () => {
    const repo = new OrganizationRepositoryMock();
    repo.seed([]);

    const useCase = new DeleteOrganizationUseCase(repo);

    const id: Organization["id"] = "missing-org";

    await expect(useCase.execute(id)).rejects.toThrow(
      new NotFoundError("Organization not found."),
    );
  });

  it("does not call delete when organization is not found (short-circuit)", async () => {
    class OrganizationRepositorySpy extends OrganizationRepositoryMock {
      public deleteCalls: Array<Organization["id"]> = [];

      override async delete(id: Organization["id"]): Promise<boolean> {
        this.deleteCalls.push(id);
        return super.delete(id);
      }
    }

    const repo = new OrganizationRepositorySpy();
    repo.seed([]);

    const useCase = new DeleteOrganizationUseCase(repo);

    const id: Organization["id"] = "missing-org";

    await expect(useCase.execute(id)).rejects.toThrow(
      new NotFoundError("Organization not found."),
    );

    expect(repo.deleteCalls).toEqual([]);
  });
});
