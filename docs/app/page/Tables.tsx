import type * as React from "react"
import { keySequence } from "~/lib/keys.ts"
import { Table as UiTable, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@booleanpress/ui/table"
import { InlineHtml } from "./Prose.tsx"

/**
 * The library's Table in the site's table box (`.bui-table`, shared with the Markdown tables): a wide table scrolls in its
 * own box, which takes keyboard focus when it must.
 */
export function Table({ caption, head, widths, children }: { caption: string; head: string[]; widths?: string[]; children: React.ReactNode }) {
  return (
    <div className="bui-table">
      {/* With widths, the columns keep them and long code wraps inside its cell instead of widening the table. */}
      <UiTable className={widths ? "table-fixed [&_code]:[overflow-wrap:anywhere] [&_code]:whitespace-normal!" : undefined}>
        {widths ? (
          <colgroup>
            {widths.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
        ) : null}
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {head.map((h) => (
              <TableHead key={h} scope="col">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr]:hover:bg-transparent">{children}</TableBody>
      </UiTable>
    </div>
  )
}

export function Keys({ keys }: { keys: string[] }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      {keySequence(keys).map(({ key, joiner }, i) => (
        <span key={`${key}-${i}`} className="inline-flex items-center gap-1">
          {joiner === "+" ? <span aria-hidden="true">+</span> : null}
          {joiner === "or" ? <span className="text-xs text-muted-foreground">or</span> : null}
          <kbd className="rounded-sm border bg-card px-1.5 py-0.5 font-mono text-xs text-[var(--docs-heading)]">{key}</kbd>
        </span>
      ))}
    </span>
  )
}

export function KeyboardTable({ rows }: { rows: { keys: string[]; behaviourHtml: string }[] }) {
  return (
    <Table caption="Keyboard" head={["Key", "Behaviour"]}>
      {rows.map((row) => (
        <tr key={row.keys.join("+") + row.behaviourHtml.length}>
          <td className="whitespace-nowrap">
            <Keys keys={row.keys} />
          </td>
          <td>
            <InlineHtml html={row.behaviourHtml} />
          </td>
        </tr>
      ))}
    </Table>
  )
}

interface PropData {
  name: string
  type: string
  default?: string
  required: boolean
  descriptionHtml: string
}

/** A type's members at its top level: `"a" | "b" | ((x: A | B) => void)` gives three, splitting no nested union. */
export function typeMembers(type: string): string[] {
  const members: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < type.length; i++) {
    const c = type[i]
    if ("<([{".includes(c)) depth++
    else if (">)]}".includes(c) && type[i - 1] !== "=") depth--
    else if (c === "|" && depth === 0) {
      members.push(type.slice(start, i).trim())
      start = i + 1
    }
  }
  members.push(type.slice(start).trim())
  return members.filter(Boolean)
}

/** A type in plain code: its members joined by bars, the line breaking after a bar rather than inside a member. */
function TypeText({ type }: { type: string }) {
  const members = typeMembers(type)
  return (
    <code className="bui-api-type">
      {members.map((member, i) => (
        <span key={`${member}-${i}`}>
          {i ? (
            <>
              <span className="bui-api-bar"> | </span>
              <wbr />
            </>
          ) : null}
          <span className="whitespace-pre-wrap [overflow-wrap:anywhere]">{member}</span>
        </span>
      ))}
    </code>
  )
}

/**
 * One part's props in three columns: the prop with what it does under it, its type, and its default. Plain code, no
 * chips, one rule between props, so a row reads left to right.
 */
export function PropsTable({ part, props }: { part: string; props: PropData[] }) {
  return (
    <div className="bui-table bui-api">
      <table className="w-full table-fixed">
        <caption className="sr-only">{`${part} props`}</caption>
        <colgroup>
          <col style={{ width: "42%" }} />
          <col style={{ width: "38%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => {
            const required = prop.required && !/\bRequired\b/.test(prop.descriptionHtml)
            return (
              <tr key={prop.name}>
                <th scope="row">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <code className="bui-api-name">{prop.name}</code>
                    {required ? <span className="text-xs font-normal text-muted-foreground">required</span> : null}
                  </span>
                  {prop.descriptionHtml ? (
                    <span className="bui-api-description">
                      <InlineHtml html={prop.descriptionHtml} />
                    </span>
                  ) : null}
                </th>
                <td>
                  <TypeText type={prop.type} />
                </td>
                <td>
                  {prop.default ? (
                    <code className="bui-api-type">{prop.default}</code>
                  ) : (
                    <span className="text-muted-foreground" aria-label="No default">
                      –
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function TokensTable({ tokens }: { tokens: { token: string; uses: string[] }[] }) {
  return (
    <Table caption="Theme tokens" head={["Token", "Used for"]}>
      {tokens.map((t) => (
        <tr key={t.token}>
          <td className="whitespace-nowrap">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="size-3.5 rounded-sm border" style={{ background: `var(--${t.token})` }} />
              <code>{`--${t.token}`}</code>
            </span>
          </td>
          <td>{t.uses.join(", ")}</td>
        </tr>
      ))}
    </Table>
  )
}
