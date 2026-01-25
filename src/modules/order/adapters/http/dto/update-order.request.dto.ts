import { IsNumber, IsNotEmpty, IsPositive } from "class-validator";

export class UpdateOrderRequestDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  totalAmount: number;
}
