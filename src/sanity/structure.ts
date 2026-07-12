import { type StructureResolver } from "sanity/structure";

// Present each page's content as a single editable document (singleton) rather
// than a list the editor can add many copies to. Each fixed document id pairs
// with the `*[_type == "..."][0]` queries in lib/queries.ts.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Verhaal")
        .id("verhaal")
        .child(S.document().schemaType("verhaal").documentId("verhaal")),
      S.listItem()
        .title("Gear")
        .id("gear")
        .child(S.document().schemaType("gear").documentId("gear")),
      S.listItem()
        .title("Samenwerken")
        .id("samenwerken")
        .child(
          S.document().schemaType("samenwerken").documentId("samenwerken"),
        ),
    ]);
