import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
