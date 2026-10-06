import type { GuideDoc } from "../types.ts"

export default {
  slug: "browser-support",
  title: "Browser support",
  description: "The browsers, frameworks and hosts the library supports, and where it is tested.",
  sections: [
    {
      id: "browsers",
      title: "Browsers",
      markdown: `| Browser | Oldest version |
| --- | --- |
| Chrome and Edge | 111 |
| Safari | 16.4 |
| Firefox | 128 |

These are the oldest versions Tailwind CSS 4 supports: it relies on cascade layers, \`@property\` and \`color-mix()\`. Older browsers show the components unstyled. The automated tests run in Chromium.

On a phone or tablet, every field shows its text at 16 px, the size below which Safari on iPhone and iPad zooms the page into a field the user taps. A single-line field keeps its height. With a mouse, fields keep their 12, 14 or 16 px text.`,
    },
    {
      id: "frameworks",
      title: "Frameworks",
      markdown: `| Runs in | Requirement | Tested |
| --- | --- | --- |
| React | 19 | 19.3 |
| Tailwind CSS | 4.1 or later | 4.3 |
| Vite | any version Tailwind CSS 4 supports | 8.3, building the packed package |
| Next.js App Router | React Server Components | 16.3: rendered on the server, then hydrated |
| WordPress admin | the important-mode recipe on [Installation](/docs/installation) | in two plugins' admin screens |

Every component that needs the browser is marked \`"use client"\`, so a server component can import it directly. The package is ESM only.`,
    },
    {
      id: "optional-packages",
      title: "Optional packages",
      markdown: `Thirteen packages are optional: you install one only when you use an entry that needs it, and an app that imports none of those entries installs and builds without them. [Installation → Optional packages](/docs/installation#optional-packages) lists each package, the components that need it and the command that adds it.`,
    },
    {
      id: "tools",
      title: "Tools",
      markdown: `The \`bui-contrast\` command runs on Node.js 22 or later.`,
    },
  ],
} satisfies GuideDoc
