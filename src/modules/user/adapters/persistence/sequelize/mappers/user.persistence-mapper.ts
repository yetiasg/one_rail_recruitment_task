import { UserModel } from "../models/user.model";
import { User } from "@modules/user/domain/entities/user.entity";

export class UserPersistenceMapper {
  static toDomain(row: UserModel): User {
    return new User(
      row.id,
      row.firstName,
      row.lastName,
      row.email,
      row.organizationId,
      row.dateCreated,
    );
  }
}
