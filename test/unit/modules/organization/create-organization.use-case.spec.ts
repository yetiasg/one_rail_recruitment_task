import { CreateOrganizationUseCase } from "@modules/organization/application/use-cases/create-organization.use-case";
import { OrganizationRepositoryMock } from "@test/unit/mocks/organization-repository.mock";
import { OrganizationBuilder } from "@test/unit/builders/organization.builder";
import { Organization } from "@modules/organization/domain/entities/organization.entity";

describe("CreateOrganizationUseCase", () => {
  it("creates organization and persists it in repository", async () => {
    const repo = new OrganizationRepositoryMock();

    const existing: Organization = new OrganizationBuilder()
      .withId("org-1")
      .withName("Existing")
      .withIndustry("FinTech")
      .withDateFounded(new Date("2010-01-01T00:00:00.000Z"))
      .build();
    repo.seed([existing]);

    const useCase = new CreateOrganizationUseCase(repo);

    const inputDate = new Date("2015-01-01T00:00:00.000Z");
    const result = await useCase.execute({
      name: "Acme Sp. z o.o.",
      industry: "SaaS",
      dateFounded: inputDate,
    });

    expect(result).toBeDefined();
    expect(result.id).toEqual(expect.any(String));
    expect(result.name).toBe("Acme Sp. z o.o.");
    expect(result.industry).toBe("SaaS");
    expect(result.dateFounded).toEqual(inputDate);

    const found = await repo.findById(result.id);
    expect(found).not.toBeNull();
    expect(found!.name).toBe("Acme Sp. z o.o.");
  });

  it("returns exactly the entity returned by repository create()", async () => {
    class OrganizationRepositorySpy extends OrganizationRepositoryMock {
      override async create(organization: Organization): Promise<Organization> {
        const created = await super.create(organization);

        const modified = new Organization(
          created.id,
          created.name.trim(),
          created.industry,
          created.dateFounded,
        );
        return modified;
      }
    }

    const repo = new OrganizationRepositorySpy();
    const useCase = new CreateOrganizationUseCase(repo);

    const result = await useCase.execute({
      name: "  Acme Sp. z o.o.  ",
      industry: "SaaS",
      dateFounded: new Date("2015-01-01T00:00:00.000Z"),
    });

    expect(result.name).toBe("Acme Sp. z o.o.");
  });

  it("creates multiple organizations with different ids", async () => {
    const repo = new OrganizationRepositoryMock();
    repo.seed([]);

    const useCase = new CreateOrganizationUseCase(repo);

    const orgA = await useCase.execute({
      name: "Org A",
      industry: "SaaS",
      dateFounded: new Date("2015-01-01T00:00:00.000Z"),
    });
    const orgB = await useCase.execute({
      name: "Org B",
      industry: "E-commerce",
      dateFounded: new Date("2018-01-01T00:00:00.000Z"),
    });

    expect(orgA.id).not.toBe(orgB.id);

    const foundA = await repo.findById(orgA.id);
    const foundB = await repo.findById(orgB.id);

    expect(foundA).not.toBeNull();
    expect(foundB).not.toBeNull();
    expect(foundA!.name).toBe("Org A");
    expect(foundB!.name).toBe("Org B");
  });

  it("passes the input dateFounded through without mutation", async () => {
    const repo = new OrganizationRepositoryMock();
    repo.seed([]);

    const useCase = new CreateOrganizationUseCase(repo);

    const dateFounded = new Date("2015-01-01T00:00:00.000Z");
    const before = dateFounded.getTime();

    const result = await useCase.execute({
      name: "Acme",
      industry: "SaaS",
      dateFounded,
    });

    expect(result.dateFounded.getTime()).toBe(before);
  });
});
