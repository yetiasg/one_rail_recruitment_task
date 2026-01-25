import type { OpenApiRouteMeta } from "@adapters/http/openapi/registry";
import { CreateOrganizationRequestDto } from "@modules/organization/adapters/http/dto/create-organization.request.dto";
import { UpdateOrganizationRequestDto } from "@modules/organization/adapters/http/dto/update-organization.request.dto";
import { SortDirection } from "@shared/pagination/pagination.type";
import { FindOrganizationsPagedResponseDto } from "./response/find-organizations-paged-response.dto";
import { OrganizationEnvelopeDto } from "./response/organization-envelope.dto";

export const organizationOpenApi: { routes: OpenApiRouteMeta[] } = {
  routes: [
    // GET /api/organizations?page=&pageSize=&sortDir=
    {
      method: "get",
      path: "/api/organizations",
      tags: ["Organizations"],
      summary: "Find organizations (paged)",
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
          description: "Sort direction",
          schema: { type: "string", enum: ["asc", "desc"] },
          example: "asc" satisfies SortDirection,
        },
      ],
      responses: {
        200: {
          description: "OK",
          dto: FindOrganizationsPagedResponseDto,
          example: {
            items: [
              {
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                name: "Acme Sp. z o.o.",
                industry: "SaaS",
                dateFounded: "2015-01-01",
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

    // GET /api/organizations/:organizationId
    {
      method: "get",
      path: "/api/organizations/:organizationId",
      tags: ["Organizations"],
      summary: "Find organization by id",
      params: [
        {
          in: "path",
          name: "organizationId",
          required: true,
          description: "Organization id (UUID v4).",
          schema: { type: "string", format: "uuid" },
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
      ],
      responses: {
        200: {
          description: "OK",
          dto: OrganizationEnvelopeDto,
          example: {
            organization: {
              id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              name: "Acme Sp. z o.o.",
              industry: "SaaS",
              dateFounded: "2015-01-01",
            },
          },
        },
        404: { description: "Organization not found" },
      },
    },

    // POST /api/organizations
    {
      method: "post",
      path: "/api/organizations",
      tags: ["Organizations"],
      summary: "Create organization",
      requestBody: {
        dto: CreateOrganizationRequestDto,
        example: {
          name: "Acme Sp. z o.o.",
          industry: "SaaS",
          dateFounded: "2015-01-01",
        },
      },
      responses: {
        201: {
          description: "Created",
          dto: OrganizationEnvelopeDto,
          example: {
            organization: {
              id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              name: "Acme Sp. z o.o.",
              industry: "SaaS",
              dateFounded: "2015-01-01",
            },
          },
        },
        400: { description: "Bad Request" },
      },
    },

    // PUT /api/organizations/:organizationId
    {
      method: "put",
      path: "/api/organizations/:organizationId",
      tags: ["Organizations"],
      summary: "Update organization",
      params: [
        {
          in: "path",
          name: "organizationId",
          required: true,
          description: "Organization id (UUID v4).",
          schema: { type: "string", format: "uuid" },
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
      ],
      requestBody: {
        dto: UpdateOrganizationRequestDto,
        example: {
          name: "Acme Sp. z o.o.",
          industry: "FinTech",
          dateFounded: "2015-01-01",
        },
      },
      responses: {
        200: { description: "OK", dto: OrganizationEnvelopeDto },
        404: { description: "Organization not found" },
      },
    },

    // DELETE /api/organizations/:organizationId
    {
      method: "delete",
      path: "/api/organizations/:organizationId",
      tags: ["Organizations"],
      summary: "Delete organization",
      params: [
        {
          in: "path",
          name: "organizationId",
          required: true,
          description: "Organization id (UUID v4).",
          schema: { type: "string", format: "uuid" },
          example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        },
      ],
      responses: {
        200: { description: "OK", dto: OrganizationEnvelopeDto },
        404: { description: "Organization not found" },
      },
    },
  ],
};
