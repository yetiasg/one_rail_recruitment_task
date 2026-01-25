import { DeleteUserUseCase } from "@modules/user/application/use-cases/delete-user.use-case";
import { UserRepositoryMock } from "@test/unit/mocks/user-repository.mock";
import { UserBuilder } from "@test/unit/builders/user.builder";
import { NotFoundError } from "@shared/errors/not-found.error";
import { User } from "@modules/user/domain/entities/user.entity";

describe("DeleteUserUseCase", () => {
  it("deletes user and returns the deleted entity", async () => {
    const repo = new UserRepositoryMock();

    const user: User = new UserBuilder()
      .withId("u-1")
      .withEmail("a@a.com")
      .build();

    repo.seed([user]);

    const useCase = new DeleteUserUseCase(repo);
    const result = await useCase.execute(user.id);

    expect(result).toEqual(user);

    const after = await repo.findById(user.id);
    expect(after).toBeNull();
  });

  it("throws NotFoundError when user does not exist", async () => {
    const repo = new UserRepositoryMock();
    repo.seed([]);

    const useCase = new DeleteUserUseCase(repo);

    const id: User["id"] = "missing-id";

    await expect(useCase.execute(id)).rejects.toThrow(
      new NotFoundError(`User ${id} not found.`),
    );
  });

  it("does not call delete when user is not found (short-circuit)", async () => {
    class UserRepositorySpy extends UserRepositoryMock {
      public deleteCalls: Array<User["id"]> = [];

      override async delete(id: User["id"]): Promise<boolean> {
        this.deleteCalls.push(id);
        return super.delete(id);
      }
    }

    const repo = new UserRepositorySpy();
    repo.seed([]);

    const useCase = new DeleteUserUseCase(repo);

    const id: User["id"] = "missing-id";

    await expect(useCase.execute(id)).rejects.toThrow(
      new NotFoundError(`User ${id} not found.`),
    );

    expect(repo.deleteCalls).toEqual([]);
  });
});
