import { Order } from "@modules/order/domain/entities/order.entity";
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from "class-validator";

export class OrderResponseDto implements Order {
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
}
