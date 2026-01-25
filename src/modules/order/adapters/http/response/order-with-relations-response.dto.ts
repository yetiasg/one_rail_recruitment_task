import { Order } from "@modules/order/domain/entities/order.entity";
import { Organization } from "@modules/organization/domain/entities/organization.entity";
import { User } from "@modules/user/domain/entities/user.entity";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";

interface OrderWithRelations extends Order {
  user: User;
  organization: Organization;
}

export class OrderWithRelationsResponseDto implements OrderWithRelations {
  @IsUUID("4")
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUUID("4")
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsUUID("4")
  @IsString()
  @IsNotEmpty()
  organizationId!: string;

  @IsNumber()
  @IsNotEmpty()
  totalAmount!: number;

  @IsDateString()
  @IsNotEmpty()
  orderDate!: Date;

  @IsObject()
  @IsNotEmpty()
  user: User;

  @IsObject()
  @IsNotEmpty()
  organization: Organization;
}

export class OrderWithRelationsEnvelopeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => OrderWithRelationsResponseDto)
  order!: OrderWithRelationsResponseDto;
}
