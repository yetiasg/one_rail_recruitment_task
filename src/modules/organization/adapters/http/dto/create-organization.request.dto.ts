import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { IsPastDate } from "@shared/validation/is-past-date.decorator";
import { IsISO8601, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateOrganizationRequestDto implements Pick<
  Organization,
  "dateFounded" | "industry" | "name"
> {
  @IsPastDate()
  @IsISO8601()
  @IsNotEmpty()
  dateFounded: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  industry: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}
