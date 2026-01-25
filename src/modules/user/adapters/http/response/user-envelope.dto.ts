import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";
import { UserResponseDto } from "./user.response.dto";

export class UserEnvelopeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UserResponseDto)
  user!: UserResponseDto;
}
