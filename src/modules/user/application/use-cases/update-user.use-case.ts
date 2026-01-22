import { User } from "@modules/user/domain/entities/user.entity";
import { UserRepositoryPort } from "../ports/user-repository.port";
import { NotFoundException } from "@kernel/http/http-exceptions";
import { Injectable } from "@kernel/di/injectable.decorator";

export interface UpdateUserInput {
  firstName: User["firstName"];
  lastName: User["lastName"];
}

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepo: UserRepositoryPort) {}

  async execute(id: User["id"], data: UpdateUserInput): Promise<User> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException("User not found.");

    return this.userRepo.update({ ...user, ...data });
  }
}
