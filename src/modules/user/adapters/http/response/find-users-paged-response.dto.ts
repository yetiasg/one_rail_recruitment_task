import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsInt,
  Min,
} from "class-validator";
import { UserResponseDto } from "./user.response.dto";

export class FindUsersPagedResponseDto {
  @IsArray()
  @IsNotEmpty()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => UserResponseDto)
  items!: UserResponseDto[];

  @IsInt()
  @Min(1)
  page!: number;

  @IsInt()
  @Min(1)
  pageSize!: number;

  @IsInt()
  @Min(0)
  total!: number;
}
