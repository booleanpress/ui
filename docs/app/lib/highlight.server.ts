// Code to HTML at build time with Shiki, in a light and a dark theme at once (CSS variables pick one), so the browser
// never loads a highlighter. GitHub's high-contrast themes keep every token, comments included, at 4.5:1 or more.
import { createHighlighter, type Highlighter } from "shiki"

let highlighter: Promise<Highlighter> | undefined

export async function highlight(code: string, lang: string): Promise<string> {
  highlighter ??= createHighlighter({ themes: ["github-light-high-contrast", "github-dark-high-contrast"], langs: ["tsx", "ts", "sh", "css", "json"] })
  const shiki = await highlighter
  const known = shiki.getLoadedLanguages().includes(lang) ? lang : "text"
  return shiki.codeToHtml(code.replace(/\n$/, ""), {
    lang: known,
    themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
    defaultColor: false,
  })
}
