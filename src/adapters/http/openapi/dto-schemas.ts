/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { validationMetadatasToSchemas } from "class-validator-jsonschema";

export type OpenApiSchemas = Record<string, unknown>;

export function buildSchemasFromDtos(): OpenApiSchemas {
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: "#/components/schemas/",
  });

  return patchBadArrayRefs(schemas);
}

function patchBadArrayRefs(schemas: OpenApiSchemas): OpenApiSchemas {
  const clone = structuredCloneSafe(schemas);

  for (const schema of Object.values(clone)) {
    patchNode(schema);
  }

  return clone;

  function patchNode(node: any): void {
    if (!node || typeof node !== "object") return;

    if (node.$ref === "#/components/schemas/Array") {
      delete node.$ref;
      node.type = "array";
      node.items = node.items ?? {};
      return;
    }

    for (const v of Object.values(node)) {
      if (Array.isArray(v)) v.forEach(patchNode);
      else patchNode(v);
    }
  }
}

function structuredCloneSafe<T>(obj: T): T {
  const sc = (globalThis as any).structuredClone;
  if (typeof sc === "function") return sc(obj);
  return JSON.parse(JSON.stringify(obj));
}
