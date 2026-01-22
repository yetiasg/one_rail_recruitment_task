import { Injectable } from "@kernel/di/injectable.decorator";
import { UserRepositoryPort } from "../ports/user-repository.port";
import { User } from "@modules/user/domain/entities/user.entity";
import { NotFoundException } from "@kernel/http/http-exceptions";

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(id: User["id"]): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}
