import type { ComponentPageData } from "~/lib/pages.server.ts"
import { InlineHtml, Prose } from "./Prose.tsx"
import { PropsTable, TokensTable } from "./Tables.tsx"

const heading = "text-lg font-medium text-[var(--docs-heading)]"

/**
 * The component's API, the last section of its page: each part's props as the reference lists them, the attributes to
 * style it by, the provider strings it reads, and the theme tokens its classes use.
 */
export function ApiReference({ page }: { page: ComponentPageData }) {
  const slots = page.parts.filter((p) => p.slot)
  return (
    <div className="flex flex-col gap-10">
      {page.parts.map((part) => (
        <section key={part.name} aria-labelledby={`api-${part.name}`} className="flex flex-col gap-2">
          <h3 id={`api-${part.name}`} className={`scroll-mt-20 font-mono ${heading}`}>
            {part.name}
          </h3>
          {part.basisHtml ? (
            <p className="bui-inline-code text-sm text-foreground">
              <InlineHtml html={part.basisHtml} />
            </p>
          ) : null}
          {part.props.length ? <PropsTable part={part.name} props={part.props} /> : null}
        </section>
      ))}

      <section aria-labelledby="api-styling" className="bui-prose flex flex-col gap-3 text-base">
        <h3 id="api-styling" className={`scroll-mt-20 ${heading}`}>
          Styling
        </h3>
        {page.helpersHtml ? (
          <p>
            <InlineHtml html={page.helpersHtml} />
          </p>
        ) : null}
        <p>
          Every part takes <code>className</code>, merged with its defaults by <code>cn()</code>, and <code>ref</code>, which reaches the element it
          renders.
        </p>
        {slots.length || page.dataAttributes.length ? (
          <p>
            <strong>Data attributes:</strong>{" "}
            {slots.map((p, i) => (
              <span key={p.name}>
                {i ? ", " : ""}
                <code>data-slot=&quot;{p.slot}&quot;</code> ({p.name})
              </span>
            ))}
            {page.dataAttributes.length ? (
              <>
                {slots.length ? ", and " : ""}
                {page.dataAttributes.map((a, i) => (
                  <code key={a}>{i ? `, ${a}` : a}</code>
                ))}
              </>
            ) : null}
            .
          </p>
        ) : null}
        {page.strings.length ? (
          <p>
            <strong>Provider strings:</strong>{" "}
            {page.strings.map((s, i) => (
              <code key={s}>{i ? `, ${s}` : s}</code>
            ))}{" "}
            (<code>BooleanUIProvider</code>&apos;s <code>strings</code>).
          </p>
        ) : null}
      </section>

      <section aria-labelledby="api-tokens" className="flex flex-col gap-3">
        <h3 id="api-tokens" className={`scroll-mt-20 ${heading}`}>
          Theme tokens
        </h3>
        {page.themingHtml ? <Prose html={page.themingHtml} /> : null}
        <p className="text-base text-foreground">The tokens its classes read. Change their values in your theme, and it follows.</p>
        <TokensTable tokens={page.tokens} />
      </section>
    </div>
  )
}
