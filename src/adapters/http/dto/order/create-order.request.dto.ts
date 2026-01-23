import { Order } from "@modules/order/domain/entities/order.entity";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateOrderRequestDto implements Pick<Order, "totalAmount"> {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalAmount: number;
}
