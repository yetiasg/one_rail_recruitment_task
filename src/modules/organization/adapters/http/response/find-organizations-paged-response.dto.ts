import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsInt,
  Min,
} from "class-validator";
import { OrganizationResponseDto } from "./organization.response.dto";

export class FindOrganizationsPagedResponseDto {
  @IsArray()
  @IsNotEmpty()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => OrganizationResponseDto)
  items!: OrganizationResponseDto[];

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
