import type { GuideDoc } from "../types.ts"

export default {
  slug: "changelog",
  title: "Changelog",
  description: "What changed in each version, and what to do when you update.",
  sections: [
    {
      id: "versions",
      title: "Versions",
      markdown: `Before 1.0.0, a minor version can change behaviour, and says how to update; a patch version only fixes. The package's own copy of this page is \`CHANGELOG.md\`.`,
      generated: "changelog",
    },
  ],
} satisfies GuideDoc
