import { FindUserByIdUseCase } from "@modules/user/application/use-cases/find-user-by-id.use-case";
import { UserRepositoryMock } from "@test/unit/mocks/user-repository.mock";
import { UserBuilder } from "@test/unit/builders/user.builder";
import { NotFoundError } from "@shared/errors/not-found.error";
import { User } from "@modules/user/domain/entities/user.entity";

describe("FindUserByIdUseCase", () => {
  it("returns user when found", async () => {
    const repo = new UserRepositoryMock();

    const user: User = new UserBuilder()
      .withId("u-1")
      .withEmail("a@a.com")
      .build();
    repo.seed([user]);

    const useCase = new FindUserByIdUseCase(repo);
    const result = await useCase.execute(user.id);

    expect(result).toEqual(user);
  });

  it("throws NotFoundError when user does not exist", async () => {
    const repo = new UserRepositoryMock();
    repo.seed([]);

    const useCase = new FindUserByIdUseCase(repo);

    await expect(useCase.execute("missing-id")).rejects.toThrow(
      new NotFoundError("User not found"),
    );
  });

  it("calls repository findById with the provided id", async () => {
    class UserRepositorySpy extends UserRepositoryMock {
      public findByIdCalls: Array<User["id"]> = [];

      override async findById(id: User["id"]): Promise<User | null> {
        this.findByIdCalls.push(id);
        return super.findById(id);
      }
    }

    const repo = new UserRepositorySpy();

    const user: User = new UserBuilder()
      .withId("u-1")
      .withEmail("a@a.com")
      .build();
    repo.seed([user]);

    const useCase = new FindUserByIdUseCase(repo);
    await useCase.execute(user.id);

    expect(repo.findByIdCalls).toEqual([user.id]);
  });
});
