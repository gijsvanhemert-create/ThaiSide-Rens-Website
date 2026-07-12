import { type SchemaTypeDefinition } from "sanity";
import { verhaal } from "./verhaal";
import { gear } from "./gear";
import { samenwerken } from "./samenwerken";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [verhaal, gear, samenwerken],
};
