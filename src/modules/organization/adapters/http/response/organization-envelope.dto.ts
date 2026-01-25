import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";
import { OrganizationResponseDto } from "./organization.response.dto";

export class OrganizationEnvelopeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => OrganizationResponseDto)
  organization!: OrganizationResponseDto;
}
