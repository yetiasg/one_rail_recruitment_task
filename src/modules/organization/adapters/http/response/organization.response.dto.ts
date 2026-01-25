import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class OrganizationResponseDto implements Organization {
  @IsUUID("4")
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  industry!: string;

  @IsDateString()
  @IsNotEmpty()
  dateFounded!: Date;
}
