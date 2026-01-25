import { UpdateUserUseCase } from "@modules/user/application/use-cases/update-user.use-case";
import { UserRepositoryMock } from "@test/unit/mocks/user-repository.mock";
import { UserBuilder } from "@test/unit/builders/user.builder";
import { NotFoundError } from "@shared/errors/not-found.error";
import { User } from "@modules/user/domain/entities/user.entity";

describe("UpdateUserUseCase", () => {
  it("updates user firstName/lastName and returns updated entity", async () => {
    const repo = new UserRepositoryMock();

    const existing: User = new UserBuilder()
      .withId("u-1")
      .withEmail("a@a.com")
      .build();
    repo.seed([existing]);

    const useCase = new UpdateUserUseCase(repo);

    const result = await useCase.execute(existing.id, {
      firstName: "Alice",
      lastName: "Smith",
    });

    expect(result.id).toBe(existing.id);
    expect(result.email).toBe(existing.email);
    expect(result.organizationId).toBe(existing.organizationId);
    expect(result.dateCreated).toEqual(existing.dateCreated);

    expect(result.firstName).toBe("Alice");
    expect(result.lastName).toBe("Smith");
  });

  it("throws NotFoundError when user does not exist", async () => {
    const repo = new UserRepositoryMock();
    repo.seed([]);

    const useCase = new UpdateUserUseCase(repo);

    await expect(
      useCase.execute("missing-id", { firstName: "A", lastName: "B" }),
    ).rejects.toThrow(new NotFoundError("User not found."));
  });

  it("calls repository update with merged entity (keeps non-updated fields intact)", async () => {
    class UserRepositorySpy extends UserRepositoryMock {
      public updateCalls: User[] = [];

      override async update(user: User): Promise<User> {
        this.updateCalls.push(user);
        return super.update(user);
      }
    }

    const repo = new UserRepositorySpy();

    const existing: User = new UserBuilder()
      .withId("u-1")
      .withEmail("orig@x.com")
      .build();
    repo.seed([existing]);

    const useCase = new UpdateUserUseCase(repo);
    await useCase.execute(existing.id, { firstName: "New", lastName: "Name" });

    expect(repo.updateCalls).toHaveLength(1);

    const payload = repo.updateCalls[0];
    expect(payload.id).toBe(existing.id);
    expect(payload.email).toBe(existing.email);
    expect(payload.organizationId).toBe(existing.organizationId);
    expect(payload.dateCreated).toEqual(existing.dateCreated);
    expect(payload.firstName).toBe("New");
    expect(payload.lastName).toBe("Name");
  });

  it("does not call update when user is not found (short-circuit)", async () => {
    class UserRepositorySpy extends UserRepositoryMock {
      public updateCalls: User[] = [];

      override async update(user: User): Promise<User> {
        this.updateCalls.push(user);
        return super.update(user);
      }
    }

    const repo = new UserRepositorySpy();
    repo.seed([]);

    const useCase = new UpdateUserUseCase(repo);

    await expect(
      useCase.execute("missing-id", { firstName: "A", lastName: "B" }),
    ).rejects.toThrow(new NotFoundError("User not found."));

    expect(repo.updateCalls).toHaveLength(0);
  });
});
