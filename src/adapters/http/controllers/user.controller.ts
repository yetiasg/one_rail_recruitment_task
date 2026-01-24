import type { Response } from "express";
import { Controller } from "@kernel/docorators/controller.decorator";
import {
  Delete,
  Get,
  Post,
  Put,
} from "@kernel/docorators/http-methods.decorator";
import { Body, Param, Query, Res } from "@kernel/docorators/params.decorator";
import { FindUsersPagedUseCase } from "@modules/user/application/use-cases/find-users-paged.use-case";
import { CreateUserRequestDto } from "@adapters/http/dto/user/create-user.request.dto";
import { CreateUserUseCase } from "@modules/user/application/use-cases/create-user.use-case";
import { UpdateUserUseCase } from "@modules/user/application/use-cases/update-user.use-case";
import { FindUserByIdUseCase } from "@modules/user/application/use-cases/find-user-by-id.use-case";
import { DeleteUserUseCase } from "@modules/user/application/use-cases/delete-user.use-case";
import { UpdateUserRequestDto } from "../dto/user/update-user.request.dto";
import { SortDirection } from "@shared/application/pagination/pagination.type";
import { CachePort } from "src/core/cache/cache.port";

@Controller("users")
export class UserController {
  constructor(
    private readonly findUsersPagedUseCase: FindUsersPagedUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly cache: CachePort,
  ) {}

  @Get()
  async findUsersPaged(
    @Query("page") pageRaw: string | undefined,
    @Query("pageSize") pageSizeRaw: string | undefined,
    @Query("sortDir") sortDir: SortDirection | undefined,
    @Res() res: Response,
  ): Promise<void> {
    await this.cache.set("elsssooo", 124, 10 * 60);

    const page = pageRaw ? Number(pageRaw) : undefined;
    const pageSize = pageSizeRaw ? Number(pageSizeRaw) : undefined;
    const result = await this.findUsersPagedUseCase.execute({
      page,
      pageSize,
      field: "email",
      direction: sortDir ?? "asc",
    });
    res.status(200).send(result);
  }

  @Get(":userId")
  async findUserById(
    @Param("userId") userId: string,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.findUserByIdUseCase.execute(userId);
    res.status(200).send({ user });
  }

  @Post()
  async createUser(
    @Body(CreateUserRequestDto) data: CreateUserRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.createUserUseCase.execute(data);
    res.status(201).send({ user });
  }

  @Put(":userId")
  async updateUser(
    @Param("userId") userId: string,
    @Body(UpdateUserRequestDto) data: UpdateUserRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.updateUserUseCase.execute(userId, data);
    res.status(200).send({ user });
  }

  @Delete(":userId")
  async deleteUser(
    @Param("userId") userId: string,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.deleteUserUseCase.execute(userId);
    res.status(200).send({ user });
  }
}
