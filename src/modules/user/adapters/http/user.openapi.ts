import type { OpenApiRouteMeta } from "@adapters/http/openapi/registry";
import { CreateUserRequestDto } from "@modules/user/adapters/http/dto/create-user.request.dto";
import { UpdateUserRequestDto } from "@modules/user/adapters/http/dto/update-user.request.dto";
import { FindUsersPagedResponseDto } from "./response/find-users-paged-response.dto";
import { UserEnvelopeDto } from "./response/user-envelope.dto";

export const userOpenApi: { routes: OpenApiRouteMeta[] } = {
  routes: [
    // GET /api/users?page=&pageSize=&sortDir=
    {
      method: "get",
      path: "/api/users",
      tags: ["Users"],
      summary: "Find users (paged)",
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
          description: 'Sort direction for "email" field.',
          schema: { type: "string", enum: ["asc", "desc"] },
          example: "asc",
        },
      ],
      responses: {
        200: {
          description: "OK",
          dto: FindUsersPagedResponseDto,
          example: {
            items: [
              {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                firstName: "Mateusz",
                lastName: "Zupa",
                email: "mateusz@example.com",
                organizationId: "11111111-1111-1111-1111-111111111111",
                dateCreated: "2026-01-25T12:00:00.000Z",
              },
            ],
            page: 1,
            pageSize: 10,
            totalItems: 1,
            totalPages: 1,
          },
        },
      },
    },

    // GET /api/users/:userId
    {
      method: "get",
      path: "/api/users/:userId",
      tags: ["Users"],
      summary: "Find user by id",
      params: [
        {
          in: "path",
          name: "userId",
          required: true,
          description: "User id (UUID v4).",
          schema: { type: "string", format: "uuid" },
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
      ],
      responses: {
        200: {
          description: "OK",
          dto: UserEnvelopeDto,
          example: {
            user: {
              id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              firstName: "Mateusz",
              lastName: "Zupa",
              email: "mateusz@example.com",
              organizationId: "11111111-1111-1111-1111-111111111111",
              dateCreated: "2026-01-25T12:00:00.000Z",
            },
          },
        },
        404: { description: "User not found" },
      },
    },

    // POST /api/users
    {
      method: "post",
      path: "/api/users",
      tags: ["Users"],
      summary: "Create user",
      requestBody: {
        dto: CreateUserRequestDto,
        example: {
          firstName: "Mateusz",
          lastName: "Zupa",
          email: "mateusz@example.com",
          organizationId: "11111111-1111-1111-1111-111111111111",
        },
      },
      responses: {
        201: {
          description: "Created",
          dto: UserEnvelopeDto,
          example: {
            user: {
              id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              firstName: "Mateusz",
              lastName: "Zupa",
              email: "mateusz@example.com",
              organizationId: "11111111-1111-1111-1111-111111111111",
              dateCreated: "2026-01-25T12:00:00.000Z",
            },
          },
        },
        404: { description: "Organization not found" },
        409: { description: "Email already used" },
        400: { description: "Bad Request" },
      },
    },

    // PUT /api/users/:userId
    {
      method: "put",
      path: "/api/users/:userId",
      tags: ["Users"],
      summary: "Update user",
      params: [
        {
          in: "path",
          name: "userId",
          required: true,
          description: "User id (UUID v4).",
          schema: { type: "string", format: "uuid" },
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
      ],
      requestBody: {
        dto: UpdateUserRequestDto,
        example: {
          firstName: "Mateusz",
          lastName: "Zupa",
          email: "mateusz.new@example.com",
        },
      },
      responses: {
        200: { description: "OK", dto: UserEnvelopeDto },
        404: { description: "User not found" },
        400: { description: "Bad Request" },
      },
    },

    // DELETE /api/users/:userId
    {
      method: "delete",
      path: "/api/users/:userId",
      tags: ["Users"],
      summary: "Delete user",
      params: [
        {
          in: "path",
          name: "userId",
          required: true,
          description: "User id (UUID v4).",
          schema: { type: "string", format: "uuid" },
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
      ],
      responses: {
        200: { description: "OK", dto: UserEnvelopeDto },
        404: { description: "User not found" },
      },
    },
  ],
};
