import { FindUsersPagedUseCase } from "@modules/user/application/use-cases/find-users-paged.use-case";
import { AppError } from "@shared/errors/app-error";
import { BadRequestError } from "@shared/errors/bad-request.error";
import { UserBuilder } from "@test/unit/builders/user.builder";
import { UserRepositoryMock } from "@test/unit/mocks/user-repository.mock";

describe("FindUsersPagedUseCase", () => {
  it("returns first page sorted by email asc", async () => {
    const repo = new UserRepositoryMock();
    repo.seed([
      new UserBuilder().withId("1").withEmail("z@z.com").build(),
      new UserBuilder().withId("2").withEmail("a@a.com").build(),
      new UserBuilder().withId("3").withEmail("m@m.com").build(),
    ]);

    const useCase = new FindUsersPagedUseCase(repo);

    const result = await useCase.execute({
      page: 1,
      pageSize: 2,
      field: "email",
      direction: "asc",
    });

    expect(result.items.map((u) => u.email)).toEqual(["a@a.com", "m@m.com"]);
    expect(result.totalItems).toBe(3);
    expect(result.totalPages).toBe(2);
  });

  it("supports sort desc", async () => {
    const repo = new UserRepositoryMock();
    repo.seed([
      new UserBuilder().withId("1").withEmail("b@b.com").build(),
      new UserBuilder().withId("2").withEmail("a@a.com").build(),
    ]);

    const useCase = new FindUsersPagedUseCase(repo);

    const result = await useCase.execute({
      page: 1,
      pageSize: 10,
      field: "email",
      direction: "desc",
    });

    expect(result.items.map((u) => u.email)).toEqual(["b@b.com", "a@a.com"]);
  });

  it("throws BadRequestException for sort field other than 'email'", async () => {
    const repo = new UserRepositoryMock();
    repo.seed([
      new UserBuilder().withId("1").withEmail("b@b.com").build(),
      new UserBuilder().withId("2").withEmail("a@a.com").build(),
    ]);

    const useCase = new FindUsersPagedUseCase(repo);

    try {
      await useCase.execute({
        page: 1,
        pageSize: 10,
        field: "firstName" as "email",
        direction: "desc",
      });
    } catch (e: unknown) {
      expect(e instanceof AppError).toBe(true);
      expect((e as AppError).name).toEqual(new BadRequestError().name);
    }
  });

  it("returns empty array", async () => {
    const repo = new UserRepositoryMock();
    repo.seed([]);

    const useCase = new FindUsersPagedUseCase(repo);

    const result = await useCase.execute({
      page: 1,
      pageSize: 10,
      field: "email",
      direction: "asc",
    });

    expect(result.items).toEqual([]);
  });
});
