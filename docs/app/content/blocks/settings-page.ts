import type { BlockDoc } from "./types.ts"

export default {
  slug: "settings-page",
  title: "Settings page",
  purpose: "A settings screen: sections behind tabs, fields grouped under their headings, and a bar that saves or discards the changes.",
  usage: `A page header, tabs for the groups of settings, and in each tab one \`FieldSet\` per section, its fields laid out as label, control and description. The bar at the bottom stays in view while the page scrolls: it says whether there are unsaved changes, and its buttons save them or put every field back as it was.

When you copy it, load the values into the fields' \`defaultValue\`s, replace the timeout in \`save\` with your request, and keep the form's \`key\`: changing it is what discards, since every field then starts again from its saved value.`,
  frameHeight: 820,
} satisfies BlockDoc
