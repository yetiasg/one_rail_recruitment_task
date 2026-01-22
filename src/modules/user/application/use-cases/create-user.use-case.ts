import { Injectable } from "@kernel/di/injectable.decorator";
import { type UserRepositoryPort } from "../ports/user-repository.port";
import { User } from "@modules/user/domain/entities/user.entity";
import { type OrganizationRepositoryPort } from "@modules/organization/application/ports/organization-repository.port";

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
      throw new Error(`Organization ${organizationId} does not exist`);

    const emailOccupied = await this.userRepo.existByEmail(email);
    if (!emailOccupied) throw new Error(`Email ${email} is already occupied`);

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
