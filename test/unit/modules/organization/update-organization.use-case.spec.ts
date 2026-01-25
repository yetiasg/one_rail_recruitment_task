import { UpdateOrganizationUseCase } from "@modules/organization/application/use-cases/update-organization.use-case";
import { OrganizationRepositoryMock } from "@test/unit/mocks/organization-repository.mock";
import { OrganizationBuilder } from "@test/unit/builders/organization.builder";
import { NotFoundError } from "@shared/errors/not-found.error";
import { Organization } from "@modules/organization/domain/entities/organization.entity";

describe("UpdateOrganizationUseCase", () => {
  it("updates organization and returns updated entity", async () => {
    const repo = new OrganizationRepositoryMock();

    const existing: Organization = new OrganizationBuilder()
      .withId("org-1")
      .withName("Old Name")
      .withIndustry("Old Industry")
      .withDateFounded(new Date("2010-01-01T00:00:00.000Z"))
      .build();
    repo.seed([existing]);

    const useCase = new UpdateOrganizationUseCase(repo);

    const newDate = new Date("2015-01-01T00:00:00.000Z");
    const result = await useCase.execute(existing.id, {
      name: "New Name",
      industry: "New Industry",
      dateFounded: newDate,
    });

    expect(result.id).toBe(existing.id);
    expect(result.name).toBe("New Name");
    expect(result.industry).toBe("New Industry");
    expect(result.dateFounded).toEqual(newDate);
  });

  it("throws NotFoundError when organization does not exist", async () => {
    const repo = new OrganizationRepositoryMock();
    repo.seed([]);

    const useCase = new UpdateOrganizationUseCase(repo);

    await expect(
      useCase.execute("missing-org", {
        name: "X",
        industry: "Y",
        dateFounded: new Date("2015-01-01T00:00:00.000Z"),
      }),
    ).rejects.toThrow(new NotFoundError("Organization not found"));
  });

  it("calls repository update with merged entity (keeps id intact)", async () => {
    class OrganizationRepositorySpy extends OrganizationRepositoryMock {
      public updateCalls: Organization[] = [];

      override async update(organization: Organization): Promise<Organization> {
        this.updateCalls.push(organization);
        return super.update(organization);
      }
    }

    const repo = new OrganizationRepositorySpy();

    const existing: Organization = new OrganizationBuilder()
      .withId("org-1")
      .withName("Old Name")
      .withIndustry("Old Industry")
      .withDateFounded(new Date("2010-01-01T00:00:00.000Z"))
      .build();
    repo.seed([existing]);

    const useCase = new UpdateOrganizationUseCase(repo);

    const newDate = new Date("2015-01-01T00:00:00.000Z");
    await useCase.execute(existing.id, {
      name: "New Name",
      industry: "New Industry",
      dateFounded: newDate,
    });

    expect(repo.updateCalls).toHaveLength(1);

    const payload = repo.updateCalls[0];
    expect(payload.id).toBe(existing.id);
    expect(payload.name).toBe("New Name");
    expect(payload.industry).toBe("New Industry");
    expect(payload.dateFounded).toEqual(newDate);
  });

  it("does not call update when organization is not found (short-circuit)", async () => {
    class OrganizationRepositorySpy extends OrganizationRepositoryMock {
      public updateCalls: Organization[] = [];

      override async update(organization: Organization): Promise<Organization> {
        this.updateCalls.push(organization);
        return super.update(organization);
      }
    }

    const repo = new OrganizationRepositorySpy();
    repo.seed([]);

    const useCase = new UpdateOrganizationUseCase(repo);

    await expect(
      useCase.execute("missing-org", {
        name: "X",
        industry: "Y",
        dateFounded: new Date("2015-01-01T00:00:00.000Z"),
      }),
    ).rejects.toThrow(new NotFoundError("Organization not found"));

    expect(repo.updateCalls).toHaveLength(0);
  });
});
