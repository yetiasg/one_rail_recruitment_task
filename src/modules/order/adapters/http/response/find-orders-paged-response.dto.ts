import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsInt,
  Min,
} from "class-validator";
import { OrderResponseDto } from "./order.response.dto";

export class FindOrdersPagedResponseDto {
  @IsArray()
  @IsNotEmpty()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => OrderResponseDto)
  items!: OrderResponseDto[];

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
