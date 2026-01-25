import { Injectable } from "@kernel/di/injectable.decorator";
import { User } from "@modules/user/domain/entities/user.entity";
import { UserRepositoryPort } from "@modules/user/domain/ports/user-repository.port";
import { NotFoundError } from "@shared/errors/not-found.error";

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(id: User["id"]): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
}
