import { defineArrayMember, defineField, defineType } from "sanity";

// The Verhaal (personal story) page. Managed as a singleton via src/sanity/structure.ts.
export const verhaal = defineType({
  name: "verhaal",
  title: "Verhaal",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Verhaal",
      description: "Het persoonlijke verhaal — meerdere alinea's en koppen mogelijk.",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normaal", value: "normal" },
            { title: "Kop", value: "h2" },
            { title: "Subkop", value: "h3" },
            { title: "Citaat", value: "blockquote" },
          ],
          lists: [
            { title: "Opsomming", value: "bullet" },
            { title: "Genummerd", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Vet", value: "strong" },
              { title: "Cursief", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  {
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) => rule.required(),
                  },
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Hero-afbeelding",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-tekst",
          type: "string",
          description: "Beschrijving voor schermlezers en SEO.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Galerij",
      description: "Optionele extra persoonlijke foto's.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt-tekst",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "heroImage" },
    prepare({ title, media }) {
      return { title: title || "Verhaal", media };
    },
  },
});
