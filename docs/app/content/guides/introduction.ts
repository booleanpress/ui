import type { GuideDoc } from "../types.ts"

export default {
  slug: "introduction",
  title: "Introduction",
  description: "Accessible React components for Tailwind CSS 4, built on Radix and Base UI, with the details finished.",
  sections: [
    {
      id: "what-it-is",
      title: "What it is",
      markdown: `BooleanPress UI is a library of 114 React components styled with Tailwind CSS 4, from buttons and fields to a data table, a tree, date pickers, an editor and a chat thread. Each interactive component is built on a Radix primitive, or a Base UI one where Radix has none, so keyboard, focus and screen-reader behaviour come from a tested base, and each is finished to one standard: every state designed, every keyboard path tested, motion that stays out of the way, and text that can be translated.

It is installed from npm as one package, \`@booleanpress/ui\`, and imported one component at a time.`,
    },
    {
      id: "what-you-get",
      title: "What you get",
      markdown: `- **Components** typed for TypeScript, with the props, parts and keyboard behaviour of each documented on its page; every control in three sizes, every field also in a filled look.
- **Blocks:** whole screens (sign-in, settings, a table page, a dashboard) built from the components, to copy.
- **A theme** of named colour tokens with light and dark values. Change the values to brand it; the components follow.
- **A provider** that hands the components their translated strings, the text direction, the locale and time zone for dates and numbers, the default size and field look, and the tooltip timing.
- **A contrast check,** \`bui-contrast\`, that names every colour pair of your palette below WCAG AA.
- **Documentation for AI assistants:** every page also ships inside the package as Markdown, matched to the version you installed.`,
    },
    {
      id: "where-it-runs",
      title: "Where it runs",
      markdown: `React 19 with Tailwind CSS 4.1 or later. It is built from the packed package and tested in a Vite app and in a Next.js App Router app (rendered on the server, then hydrated), and it runs inside the WordPress admin. Browsers: Chrome 111, Safari 16.4 and Firefox 128 or later, the oldest Tailwind CSS 4 supports; the automated tests run in Chromium.`,
    },
    {
      id: "next-steps",
      title: "Next steps",
      markdown: `Start with [Installation](/docs/installation), then open any component in the list on the left. Each page has live examples you can copy, its keyboard table, and its API.`,
    },
  ],
} satisfies GuideDoc
