import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";
import { OrderResponseDto } from "./order.response.dto";

export class OrderEnvelopeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => OrderResponseDto)
  order!: OrderResponseDto;
}
