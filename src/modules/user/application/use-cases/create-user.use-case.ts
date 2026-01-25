import { Injectable } from "@kernel/di/injectable.decorator";
import { User } from "@modules/user/domain/entities/user.entity";
import { UserRepositoryPort } from "@modules/user/domain/ports/user-repository.port";
import { OrganizationRepositoryPort } from "@modules/organization/domain/ports/organization-repository.port";
import { NotFoundError } from "@shared/errors/not-found.error";

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  organizationId: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly orgRepo: OrganizationRepositoryPort,
  ) {}

  async execute({
    firstName,
    lastName,
    email,
    organizationId,
  }: CreateUserInput): Promise<User> {
    const orgExists = await this.orgRepo.existsById(organizationId);
    if (!orgExists)
      throw new NotFoundError(`Organization ${organizationId} does not exist`);

    const emailOccupied = await this.userRepo.existByEmail(email);
    if (emailOccupied)
      throw new NotFoundError(`Email ${email} is already occupied`);

    const user = new User(
      crypto.randomUUID(),
      firstName,
      lastName,
      email,
      organizationId,
      new Date(),
    );

    return this.userRepo.create(user);
  }
}
