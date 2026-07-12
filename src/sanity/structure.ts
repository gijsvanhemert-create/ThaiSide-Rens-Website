import { type StructureResolver } from "sanity/structure";

// Present Verhaal as a single editable document (singleton) rather than a list
// the editor can add many copies to. The fixed document id pairs with the
// `*[_type == "verhaal"][0]` query in lib/queries.ts.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Verhaal")
        .id("verhaal")
        .child(
          S.document().schemaType("verhaal").documentId("verhaal"),
        ),
    ]);
