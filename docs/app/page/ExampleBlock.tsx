import * as React from "react"
import { ChevronsDownUpIcon, CodeXmlIcon, Maximize2Icon, MonitorIcon, SmartphoneIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Spinner } from "@booleanpress/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"
import { cn } from "@booleanpress/ui/utils"
import { exampleHref } from "~/content/registry.ts"
import { EXAMPLES } from "~/lib/examples.ts"
import { useSettings, type Settings } from "~/lib/settings.tsx"
import { CopyButton, toolbarButton } from "./CopyButton.tsx"
import { InlineHtml, SectionHeading } from "./Prose.tsx"

export interface ExampleData {
  id: string
  title: string
  descriptionHtml: string
  code: string
  codeHtml: string
  frameHeight?: number
}

/** The width a block's frame takes at "Phone": a common phone's, in CSS pixels. */
const PHONE_WIDTH = 390

/** The reader's settings as the query of an example's own page, which reads them from there. */
function exampleQuery(settings: Settings): string {
  return new URLSearchParams({ ...settings, frame: settings.frame === "wp" ? "wp" : "plain" }).toString()
}

/**
 * The example in an iframe of its own page: inside the WordPress admin frame, so WordPress's CSS never reaches the site,
 * or at a fixed height for a component that positions itself against the window, or at a phone's width for a block.
 */
function FramedExample({ slug, id, title, height: fixedHeight, width }: { slug: string; id: string; title: string; height?: number; width?: number }) {
  const { settings } = useSettings()
  const ref = React.useRef<HTMLIFrameElement>(null)
  const [measured, setHeight] = React.useState(320)
  const wp = settings.frame === "wp"
  const height = fixedHeight ? fixedHeight + (wp ? 32 : 0) : measured

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source === ref.current?.contentWindow && event.data?.type === "bui-example-height") {
        setHeight(Math.max(240, Math.ceil(event.data.height)))
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return (
    <iframe
      ref={ref}
      title={wp ? `${title} in the WordPress admin frame` : title}
      src={`${exampleHref(slug, id)}?${exampleQuery(settings)}`}
      // Each frame loads the whole site again: in the WordPress frame a page holds up to 25, so only the ones near the
      // window load.
      loading="lazy"
      className={cn("block rounded-lg border-0", width ? "mx-auto max-w-full bg-background shadow-[0_0_0_0.5px_var(--docs-edge)]" : "w-full")}
      style={{ height, width }}
    />
  )
}

export function LiveExample({ slug, id }: { slug: string; id: string }) {
  const Example = EXAMPLES[`${slug}/${id}`]
  if (!Example) return <p className="text-sm text-destructive-strong">Missing example: {slug}/{id}</p>
  return (
    // `data-example-loading` marks the wait, so a browser test can wait for the example itself.
    <React.Suspense fallback={<Spinner data-example-loading="" />}>
      <Example />
    </React.Suspense>
  )
}

/** Code this short is shown whole; longer code opens on its first three lines under a "View Code" button. */
const SHORT_CODE_LINES = 3

/**
 * The example's code with numbered lines. Closed, it shows its first three lines fading out under a "View Code" button;
 * open, it scrolls in a box at most 300px tall, which takes keyboard focus so it can be scrolled without a mouse.
 */
function ExampleCode({ id, title, html, open, onOpen }: { id: string; title: string; html: string; open: boolean; onOpen: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const view = () => {
    onOpen()
    // The button goes away with the fade, so focus moves into the code it opened.
    requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }))
  }
  return (
    <div className="relative">
      <div
        ref={ref}
        id={id}
        role="region"
        aria-label={`${title}: code`}
        // Code reads left to right in a right-to-left page too.
        dir="ltr"
        tabIndex={open ? 0 : -1}
        className={cn(
          "bui-code bui-code-lines rounded-lg shadow-[0_0_0_0.5px_var(--docs-edge)] focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring",
          open ? "max-h-[300px] overflow-auto" : "h-24 overflow-hidden"
        )}
        data-pagefind-ignore=""
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {open ? null : (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-linear-to-b from-transparent from-25% via-card/60 to-card">
          <Button variant="outline" className="h-8 rounded-lg bg-card px-3 text-sm text-[var(--docs-heading)] shadow-xs" aria-expanded={false} aria-controls={id} onClick={view}>
            View Code
          </Button>
        </div>
      )}
    </div>
  )
}

/** The two widths a block's frame shows it at. */
type FrameWidth = "desktop" | "phone"

/**
 * One example as the reference design frames it: a grey frame holding a white preview card (the example's name in a chip,
 * the code button, the link to the example's own page, the copy button) and, under it, the example's code, open on its
 * first lines. A block (`widths`) also gets a Desktop and Phone switch, which sets the width of its frame. The preview at
 * the top of a page (`preview`) is chipped "Preview", has no link of its own, and shows no code until its code button
 * opens it.
 */
export function ExampleFrame({
  slug,
  example,
  widths = false,
  preview = false,
  className,
}: {
  slug: string
  example: ExampleData
  widths?: boolean
  preview?: boolean
  className?: string
}) {
  const { settings } = useSettings()
  const framed = settings.frame === "wp" || Boolean(example.frameHeight)
  const codeId = `${preview ? "preview" : `example-${example.id}`}-code`
  const short = example.code.trimEnd().split("\n").length <= SHORT_CODE_LINES
  const [open, setOpen] = React.useState(!preview && short)
  // The preview shows no code until its code button opens it; an example shows its first lines until then.
  const codeShown = !preview || open
  const [width, setWidth] = React.useState<FrameWidth>("desktop")
  const phone = widths && width === "phone"
  return (
    <div
      className={cn(
        "m-px space-y-2.25 rounded-[14px] bg-[var(--docs-frame)] p-2 shadow-[0_0_0_0.5px_var(--docs-edge)]",
        // A page-sized example (Sidebar) reaches into the gutters, so its frame is wider than the 768px phone breakpoint.
        example.frameHeight && !widths && "md:-mx-6",
        className
      )}
    >
      <div className="flex flex-col overflow-hidden rounded-lg bg-card shadow-[0_0_0_0.5px_var(--docs-edge)]">
        <div
          className={cn(
            "bui-example flex items-center justify-center",
            framed ? "overflow-hidden p-0" : "px-8 pt-8 pb-5 md:px-10 md:pt-10 md:pb-7",
            // At a phone's width the frame stands on the grey of the surround, as a phone on a desk.
            phone && "bg-[var(--docs-frame)] py-4"
          )}
          data-example={`${slug}/${example.id}`}
        >
          {framed ? (
            <FramedExample
              slug={slug}
              id={example.id}
              title={`${example.title} example`}
              height={example.frameHeight}
              width={phone ? PHONE_WIDTH : undefined}
            />
          ) : (
            <LiveExample slug={slug} id={example.id} />
          )}
        </div>
        <div className="flex items-center gap-2 py-1.5 ps-2.5 pe-1.5" data-pagefind-ignore="">
          {/* The example's name again, as a label for the eye: the heading above already names it. */}
          <span aria-hidden="true" className="rounded-md bg-[var(--docs-chip)] px-2 py-1.5 font-mono text-sm leading-3 tracking-tight whitespace-nowrap text-[var(--docs-chip-foreground)] uppercase">
            {preview ? "Preview" : example.id}
          </span>
          {widths ? (
            <ToggleGroup
              type="single"
              value={width}
              onValueChange={(value) => value && setWidth(value as FrameWidth)}
              aria-label={`Width of the ${example.title} preview`}
              className="gap-px"
            >
              <ToggleGroupItem value="desktop" aria-label="Desktop" className={cn(toolbarButton, "data-[state=on]:bg-secondary data-[state=on]:text-[var(--docs-heading)]")}>
                <MonitorIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="phone" aria-label="Phone" className={cn(toolbarButton, "data-[state=on]:bg-secondary data-[state=on]:text-[var(--docs-heading)]")}>
                <SmartphoneIcon />
              </ToggleGroupItem>
            </ToggleGroup>
          ) : null}
          <div className="ms-auto flex items-center gap-px">
            {preview || !short ? (
              <Button
                variant="ghost"
                className={toolbarButton}
                // One name in both states: aria-expanded says whether the code is open.
                aria-label={preview ? "Code of the preview" : `Code of ${example.title}`}
                aria-expanded={open}
                aria-controls={codeShown ? codeId : undefined}
                onClick={() => setOpen(!open)}
              >
                {open ? <ChevronsDownUpIcon /> : <CodeXmlIcon />}
              </Button>
            ) : null}
            {preview ? null : (
              <Button asChild variant="ghost" className={toolbarButton}>
                <a
                  href={`${exampleHref(slug, example.id)}?${exampleQuery(settings)}`}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Open ${example.title} on its own page (opens in a new tab)`}
                >
                  <Maximize2Icon />
                </a>
              </Button>
            )}
            <CopyButton code={example.code} label={preview ? "Copy the code of the preview" : `Copy the code of ${example.title}`} />
          </div>
        </div>
      </div>
      {codeShown ? (
        <ExampleCode id={codeId} title={preview ? "Preview" : example.title} html={example.codeHtml} open={open} onOpen={() => setOpen(true)} />
      ) : null}
    </div>
  )
}

/** One example of a component page: its heading, the sentence on what it shows, and its frame. */
export function ExampleBlock({ slug, example }: { slug: string; example: ExampleData }) {
  return (
    <section aria-labelledby={`example-${example.id}`}>
      <SectionHeading id={`example-${example.id}`} level={3}>
        {example.title}
      </SectionHeading>
      <p className="bui-inline-code mb-4 text-base text-foreground">
        <InlineHtml html={example.descriptionHtml} />
      </p>
      <ExampleFrame slug={slug} example={example} className="mb-16" />
    </section>
  )
}
