import { defineArrayMember, defineField, defineType } from "sanity";

// The Gear (affiliate) page. Managed as a singleton via src/sanity/structure.ts.
export const gear = defineType({
  name: "gear",
  title: "Gear",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introductie",
      description: "Korte introductie boven de gear-lijst.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "products",
      title: "Producten",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "product",
          title: "Product",
          fields: [
            defineField({
              name: "name",
              title: "Productnaam",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "image",
              title: "Afbeelding",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt-tekst",
                  type: "string",
                  description: "Beschrijving voor schermlezers en SEO.",
                }),
              ],
            }),
            defineField({
              name: "description",
              title: "Omschrijving",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "affiliateLink",
              title: "Affiliate-link",
              type: "url",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "whyIUse",
              title: "Waarom ik dit gebruik",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "affiliateLink", media: "image" },
            prepare({ title, subtitle, media }) {
              return { title: title || "Product", subtitle, media };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Gear" };
    },
  },
});
