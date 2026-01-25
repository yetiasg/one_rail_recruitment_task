import type { OpenApiRouteMeta } from "@adapters/http/openapi/registry";
import { SortDirection } from "@shared/pagination/pagination.type";
import { CreateOrderRequestDto } from "@modules/order/adapters/http/dto/create-order.request.dto";
import { UpdateOrderRequestDto } from "@modules/order/adapters/http/dto/update-order.request.dto";
import { OrderEnvelopeDto } from "./response/order-envelope.dto";
import { FindOrdersPagedResponseDto } from "./response/find-orders-paged-response.dto";
import { OrderWithRelationsEnvelopeDto } from "./response/order-with-relations-response.dto";

export const orderOpenApi: { routes: OpenApiRouteMeta[] } = {
  routes: [
    // GET /api/orders?page=&pageSize=&sortDir=
    {
      method: "get",
      path: "/api/orders",
      tags: ["Orders"],
      summary: "Find orders (paged)",
      params: [
        {
          in: "query",
          name: "page",
          required: false,
          description: "Page number",
          schema: { type: "integer", minimum: 1 },
          example: 1,
        },
        {
          in: "query",
          name: "pageSize",
          required: false,
          description: "Items per page",
          schema: { type: "integer", minimum: 1, maximum: 200 },
          example: 10,
        },
        {
          in: "query",
          name: "sortDir",
          required: false,
          description: 'Sort direction for "orderDate" field.',
          schema: { type: "string", enum: ["asc", "desc"] },
          example: "asc" satisfies SortDirection,
        },
      ],
      responses: {
        200: {
          description: "OK",
          dto: FindOrdersPagedResponseDto,
          example: {
            items: [
              {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                orderDate: "2026-01-25T12:00:00.000Z",
                totalAmount: 199.99,
                userId: "11111111-1111-1111-1111-111111111111",
                organizationId: "22222222-2222-2222-2222-222222222222",
              },
            ],
            page: 1,
            pageSize: 10,
            total: 1,
          },
        },
      },
    },

    // GET /api/orders/:orderId
    {
      method: "get",
      path: "/api/orders/:orderId",
      tags: ["Orders"],
      summary: "Find order by id",
      params: [
        {
          in: "path",
          name: "orderId",
          required: true,
          description: "Order id (UUID v4).",
          schema: { type: "string", format: "uuid" },
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
      ],
      responses: {
        200: {
          description: "OK",
          dto: OrderWithRelationsEnvelopeDto,
          example: {
            order: {
              id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              orderDate: "2026-01-25T12:00:00.000Z",
              totalAmount: 199.99,
              userId: "11111111-1111-1111-1111-111111111111",
              organizationId: "22222222-2222-2222-2222-222222222222",
              user: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                firstName: "Mateusz",
                lastName: "Zupa",
                email: "mateusz@example.com",
                organizationId: "11111111-1111-1111-1111-111111111111",
                dateCreated: "2026-01-25T12:00:00.000Z",
              },
              organization: {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                name: "Acme Sp. z o.o.",
                industry: "SaaS",
                dateFounded: "2015-01-01",
              },
            },
          },
        },
        404: { description: "Order not found" },
      },
    },

    // POST /api/orders
    {
      method: "post",
      path: "/api/orders",
      tags: ["Orders"],
      summary: "Create order",
      requestBody: {
        dto: CreateOrderRequestDto,
        example: {
          userId: "11111111-1111-1111-1111-111111111111",
          totalAmount: 199.99,
        },
      },
      responses: {
        201: {
          description: "Created",
          dto: OrderEnvelopeDto,
          example: {
            order: {
              id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              orderDate: "2026-01-25T12:00:00.000Z",
              totalAmount: 199.99,
              userId: "11111111-1111-1111-1111-111111111111",
              organizationId: "22222222-2222-2222-2222-222222222222",
            },
          },
        },
        404: { description: "User not found" },
        400: { description: "Bad Request" },
      },
    },

    // PUT /api/orders/:orderId
    {
      method: "put",
      path: "/api/orders/:orderId",
      tags: ["Orders"],
      summary: "Update order",
      params: [
        {
          in: "path",
          name: "orderId",
          required: true,
          description: "Order id (UUID v4).",
          schema: { type: "string", format: "uuid" },
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
      ],
      requestBody: {
        dto: UpdateOrderRequestDto,
        example: {
          totalAmount: 249.99,
        },
      },
      responses: {
        200: { description: "OK", dto: OrderEnvelopeDto },
        404: { description: "Order not found" },
        400: { description: "Bad Request" },
      },
    },

    // DELETE /api/orders/:orderId
    {
      method: "delete",
      path: "/api/orders/:orderId",
      tags: ["Orders"],
      summary: "Delete order",
      params: [
        {
          in: "path",
          name: "orderId",
          required: true,
          description: "Order id (UUID v4).",
          schema: { type: "string", format: "uuid" },
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
      ],
      responses: {
        200: { description: "OK", dto: OrderEnvelopeDto },
        404: { description: "Order not found" },
      },
    },
  ],
};
