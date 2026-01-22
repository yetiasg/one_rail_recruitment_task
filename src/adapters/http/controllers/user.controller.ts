import type { Response } from "express";
import { Controller } from "@kernel/docorators/controller.decorator";
import {
  Delete,
  Get,
  Post,
  Put,
} from "@kernel/docorators/http-methods.decorator";
import { Body, Param, Query, Res } from "@kernel/docorators/params.decorator";
import { FindUsersUseCase } from "@modules/user/application/use-cases/find-users/find-users.use-case";
import { CreateUserRequestDto } from "@adapters/http/dto/user/requests/create-user.request.dto";
import { CreateUserUseCase } from "@modules/user/application/use-cases/create-user.use-case";
import { UpdateUserUseCase } from "@modules/user/application/use-cases/update-user.use-case";
import { FindUserByIdUseCase } from "@modules/user/application/use-cases/find-user-by-id.use-case";
import { DeleteUserUseCase } from "@modules/user/application/use-cases/delete-user.use-case";

@Controller("users")
export class UserController {
  constructor(
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get()
  async findUsers(
    @Query("page") pageRaw: string | undefined,
    @Query("pageSize") pageSizeRaw: string | undefined,
    @Query("sortDir") sortDir: "asc" | "desc" | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const page = pageRaw ? Number(pageRaw) : undefined;
    const pageSize = pageSizeRaw ? Number(pageSizeRaw) : undefined;
    const result = await this.findUsersUseCase.execute({
      page,
      pageSize,
      sortBy: "email",
      sortDir: sortDir ?? "asc",
    });
    res.status(200).send(result);
  }

  @Get(":userId")
  async findUser(
    @Param("userId") userId: string,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.findUserByIdUseCase.execute(userId);
    res.status(200).send(user);
  }

  @Post()
  async createUser(
    @Body(CreateUserRequestDto) userData: CreateUserRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.createUserUseCase.execute(userData);
    res.status(201).send(user);
  }

  @Put(":userId")
  async updateUser(
    @Param("userId") userId: string,
    @Body(CreateUserRequestDto) data: CreateUserRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.updateUserUseCase.execute(userId, data);
    res.status(201).send(user);
  }

  @Delete(":userId")
  async deleteUser(
    @Param("userId") userId: string,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.deleteUserUseCase.execute(userId);
    res.status(201).send(user);
  }
}
