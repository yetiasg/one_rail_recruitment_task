import { userOpenApi } from "@modules/user/adapters/http/user.openapi";
import { registerOpenApiRoutes } from "./registry";
import { organizationOpenApi } from "@modules/organization/adapters/http/organization.openapi";
import { orderOpenApi } from "@modules/order/adapters/http/order.openai";

export function registerOpenApiModules(): void {
  registerOpenApiRoutes(organizationOpenApi.routes);
  registerOpenApiRoutes(userOpenApi.routes);
  registerOpenApiRoutes(orderOpenApi.routes);
}
