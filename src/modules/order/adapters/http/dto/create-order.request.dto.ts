import { Order } from "@modules/order/domain/entities/order.entity";
import { User } from "@modules/user/domain/entities/user.entity";
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateOrderRequestDto implements Pick<
  Order,
  "totalAmount" | "userId"
> {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  totalAmount: number;

  // todo - delete
  @IsString()
  @IsNotEmpty()
  @IsUUID("4")
  userId: User["id"];
}
