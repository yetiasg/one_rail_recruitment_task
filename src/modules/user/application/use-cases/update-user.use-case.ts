import { User } from "@modules/user/domain/entities/user.entity";
import { Injectable } from "@kernel/di/injectable.decorator";
import { UserRepositoryPort } from "@modules/user/domain/ports/user-repository.port";
import { NotFoundError } from "@shared/errors/not-found.error";

export interface UpdateUserInput {
  firstName: User["firstName"];
  lastName: User["lastName"];
}

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(id: User["id"], data: UpdateUserInput): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError("User not found.");

    return this.userRepo.update({ ...user, ...data });
  }
}
