import type { Request, Response } from "express";
import { Controller } from "@kernel/docorators/controller.decorator";
import {
  Delete,
  Get,
  Post,
  Put,
} from "@kernel/docorators/http-methods.decorator";
import { FindOrderByIdUseCase } from "@modules/order/application/use-cases/find-order-by-id.use-case";
import { CreateOrderUseCase } from "@modules/order/application/use-cases/create-order.use-case";
import { UpdateOrderUseCase } from "@modules/order/application/use-cases/update-order.use-case";
import { DeleteOrderUseCase } from "@modules/order/application/use-cases/delete-order.use-case";
import { FindOrdersPagedUseCase } from "@modules/order/application/use-cases/find-orders-paged.use-case";
import { Body, Param, Query, Res } from "@kernel/docorators/params.decorator";
import { CreateOrderRequestDto } from "../dto/order/create-order.request.dto";
import { UpdateOrderRequestDto } from "../dto/order/update-order.request.dto";
import { SortDirection } from "@shared/application/pagination/pagination.type";

@Controller("orders")
export class OrderController {
  constructor(
    private readonly findOrdersPagedUseCase: FindOrdersPagedUseCase,
    private readonly findOrderByIdUseCase: FindOrderByIdUseCase,
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
  ) {}

  @Get()
  async findOrdersPaged(
    @Query("page") pageRaw: string | undefined,
    @Query("pageSize") pageSizeRaw: string | undefined,
    @Query("sortDir") sortDir: SortDirection | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const page = pageRaw ? Number(pageRaw) : undefined;
    const pageSize = pageSizeRaw ? Number(pageSizeRaw) : undefined;
    const result = await this.findOrdersPagedUseCase.execute({
      page,
      pageSize,
      field: "orderDate",
      direction: sortDir ?? "asc",
    });
    res.status(200).send(result);
  }

  @Get(":orderId")
  async findOrderById(
    @Param("orderId") orderId: string,
    @Res() res: Response,
  ): Promise<void> {
    const order = await this.findOrderByIdUseCase.execute(orderId);
    res.status(200).send({ order });
  }

  @Post()
  async createOrder(
    @Body(CreateOrderRequestDto) data: CreateOrderRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const order = await this.createOrderUseCase.execute({
      ...data,
      // todo - user auth
      userId: "",
    });
    res.status(201).send({ order });
  }

  @Put(":orderId")
  async updateOrder(
    @Param("orderId") orderId: string,
    @Body(UpdateOrderRequestDto) data: UpdateOrderRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const order = await this.updateOrderUseCase.execute(orderId, data);
    res.status(200).send({ order });
  }

  @Delete(":orderId")
  async deleteOrder(
    @Param("orderId") orderId: string,
    @Res() res: Response,
  ): Promise<void> {
    const order = await this.deleteOrderUseCase.execute(orderId);
    res.status(200).send({ order });
  }
}
