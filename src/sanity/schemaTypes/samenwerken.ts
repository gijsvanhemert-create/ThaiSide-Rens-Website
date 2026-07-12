import { defineArrayMember, defineField, defineType } from "sanity";

// The Samenwerken (sponsorship/collaboration) page. Managed as a singleton via
// src/sanity/structure.ts.
export const samenwerken = defineType({
  name: "samenwerken",
  title: "Samenwerken",
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
      description: "Introtekst boven de samenwerkingsinformatie.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "reachStats",
      title: "Bereikcijfers",
      description:
        "Bijvoorbeeld YouTube-abonnees, Instagram-volgers of maandelijkse views.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          title: "Cijfer",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              description: "Bijv. \"YouTube-abonnees\".",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Waarde",
              description: "Bijv. \"50K\" of \"1,2M\".",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
            prepare({ title, subtitle }) {
              return { title: title || "—", subtitle };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "collaborationTypes",
      title: "Samenwerkingsvormen",
      description: "De soorten samenwerkingen die mogelijk zijn.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "collaborationType",
          title: "Samenwerkingsvorm",
          fields: [
            defineField({
              name: "title",
              title: "Titel",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Omschrijving",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
            prepare({ title, subtitle }) {
              return { title: title || "Samenwerkingsvorm", subtitle };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Samenwerken" };
    },
  },
});
