import { CreateUserUseCase } from "@modules/user/application/use-cases/create-user.use-case";
import { UserBuilder } from "@test/unit/builders/user.builder";
import { UserRepositoryMock } from "@test/unit/mocks/user-repository.mock";
import { ConflictError } from "@shared/errors/conflict.error";
import { NotFoundError } from "@shared/errors/not-found.error";
import { OrganizationRepositoryMock } from "@test/unit/mocks/organization-repository.mock";
import { Organization } from "@modules/organization/domain/entities/organization.entity";

describe("CreateUserUseCase", () => {
  it("creates user when organization exists and email is free", async () => {
    const userRepo = new UserRepositoryMock();
    const orgRepo = new OrganizationRepositoryMock();

    const organization: Organization = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: "Acme Sp. z o.o.",
      industry: "SaaS",
      dateFounded: new Date("2015-01-01"),
    };
    orgRepo.seed([organization]);

    userRepo.seed([
      new UserBuilder()
        .withId("u-1")
        .withEmail("taken@x.com")
        .withOrganizationId(organization.id)
        .build(),
    ]);

    const useCase = new CreateUserUseCase(userRepo, orgRepo);

    const result = await useCase.execute({
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@x.com",
      organizationId: organization.id,
    });

    expect(result).toBeDefined();
    expect(result.id).toEqual(expect.any(String));
    expect(result.firstName).toBe("Alice");
    expect(result.lastName).toBe("Smith");
    expect(result.email).toBe("alice@x.com");
    expect(result.organizationId).toBe(organization.id);
    expect(result.dateCreated).toBeInstanceOf(Date);

    const found = await userRepo.findById(result.id);
    expect(found).not.toBeNull();
    expect(found!.email).toBe("alice@x.com");
  });

  it("throws NotFoundError when organization does not exist", async () => {
    const userRepo = new UserRepositoryMock();
    const orgRepo = new OrganizationRepositoryMock();

    const organizationId = "org-missing";
    orgRepo.seed([]); // no organization

    const useCase = new CreateUserUseCase(userRepo, orgRepo);

    await expect(
      useCase.execute({
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@x.com",
        organizationId,
      }),
    ).rejects.toThrow(NotFoundError);

    await expect(
      useCase.execute({
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@x.com",
        organizationId,
      }),
    ).rejects.toThrow(
      new NotFoundError(`Organization ${organizationId} does not exist`),
    );
  });

  it("throws ConflictError when email is already used", async () => {
    const userRepo = new UserRepositoryMock();
    const orgRepo = new OrganizationRepositoryMock();

    const organization: Organization = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: "Acme Sp. z o.o.",
      industry: "SaaS",
      dateFounded: new Date("2015-01-01"),
    };
    orgRepo.seed([organization]);

    userRepo.seed([
      new UserBuilder()
        .withId("u-1")
        .withEmail("dup@x.com")
        .withOrganizationId(organization.id)
        .build(),
    ]);

    const useCase = new CreateUserUseCase(userRepo, orgRepo);

    await expect(
      useCase.execute({
        firstName: "Alice",
        lastName: "Smith",
        email: "dup@x.com",
        organizationId: organization.id,
      }),
    ).rejects.toThrow(new ConflictError("Email already used"));
  });

  it("does not check email occupancy if organization is missing (short-circuit to NotFoundError)", async () => {
    const userRepo = new UserRepositoryMock();
    const orgRepo = new OrganizationRepositoryMock();

    const organizationId = "org-missing";
    orgRepo.seed([]);

    userRepo.seed([
      new UserBuilder().withId("u-1").withEmail("dup@x.com").build(),
    ]);

    const useCase = new CreateUserUseCase(userRepo, orgRepo);

    await expect(
      useCase.execute({
        firstName: "Alice",
        lastName: "Smith",
        email: "dup@x.com",
        organizationId,
      }),
    ).rejects.toThrow(
      new NotFoundError(`Organization ${organizationId} does not exist`),
    );
  });

  it("creates user even if other users exist in different organizations, as long as email is unique globally", async () => {
    const userRepo = new UserRepositoryMock();
    const orgRepo = new OrganizationRepositoryMock();

    const orgA: Organization = {
      id: "1",
      name: "1 Acme Sp. z o.o.",
      industry: "SaaS",
      dateFounded: new Date("2015-01-01"),
    };
    const orgB: Organization = {
      id: "2",
      name: "2 Acme Sp. z o.o.",
      industry: "SaaS",
      dateFounded: new Date("2015-01-01"),
    };

    orgRepo.seed([orgA, orgB]);

    userRepo.seed([
      new UserBuilder()
        .withId("u-1")
        .withEmail("a@x.com")
        .withOrganizationId(orgA.id)
        .build(),
      new UserBuilder()
        .withId("u-2")
        .withEmail("b@x.com")
        .withOrganizationId(orgB.id)
        .build(),
    ]);

    const useCase = new CreateUserUseCase(userRepo, orgRepo);

    const result = await useCase.execute({
      firstName: "Carol",
      lastName: "Jones",
      email: "carol@x.com",
      organizationId: orgA.id,
    });

    expect(result.email).toBe("carol@x.com");
    expect(result.organizationId).toBe(orgA.id);
  });

  it("throws ConflictError when email differs only by case IF repository treats it as occupied (documenting current behavior)", async () => {
    const userRepo = new UserRepositoryMock();
    const orgRepo = new OrganizationRepositoryMock();

    const organization: Organization = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      name: "Acme Sp. z o.o.",
      industry: "SaaS",
      dateFounded: new Date("2015-01-01"),
    };
    orgRepo.seed([organization]);

    userRepo.seed([
      new UserBuilder()
        .withId("u-1")
        .withEmail("Alice@x.com")
        .withOrganizationId(organization.id)
        .build(),
    ]);

    const useCase = new CreateUserUseCase(userRepo, orgRepo);

    await expect(
      useCase.execute({
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@x.com",
        organizationId: organization.id,
      }),
    ).rejects.toThrow(new ConflictError("Email already used"));
  });
});
