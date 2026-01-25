import { User } from "@modules/user/domain/entities/user.entity";
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from "class-validator";

export class UserResponseDto implements User {
  @IsUUID("4")
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsUUID("4")
  @IsNotEmpty()
  organizationId!: string;

  @IsDateString()
  @IsNotEmpty()
  dateCreated!: Date;
}
