// Timeline: built on semantic HTML — an ordered list, one list item per event, with no primitive.
import * as React from "react"
import { cn } from "@/lib/utils"

/** Which side of the line the content takes, in reading order. @since 0.1.1 */
type TimelineAlign = "start" | "end" | "alternate"

/** The way the events run. @since 0.1.1 */
type TimelineOrientation = "vertical" | "horizontal"

/**
 * The grid every event shares, as custom properties on the list: the areas of an odd and an even event, the tracks, and
 * the text alignment of each side. One event is a grid of three areas, so the order of its parts in the markup is the
 * reading order, whatever side they are drawn on.
 */
function layoutVariables(orientation: TimelineOrientation, align: TimelineAlign): React.CSSProperties {
  const vertical = orientation === "vertical"
  const contentAfter = vertical ? '"opposite separator content"' : '"opposite" "separator" "content"'
  const contentBefore = vertical ? '"content separator opposite"' : '"content" "separator" "opposite"'
  const oddBefore = align === "end"
  const evenBefore = align === "end" || align === "alternate"

  return {
    "--timeline-areas": oddBefore ? contentBefore : contentAfter,
    "--timeline-areas-even": evenBefore ? contentBefore : contentAfter,
    // The side without content collapses unless an event has opposite content (then both sides share the width, see
    // TimelineItem) or the events alternate.
    "--timeline-tracks":
      align === "alternate"
        ? "minmax(0,1fr) auto minmax(0,1fr)"
        : align === "end"
          ? "minmax(0,1fr) auto auto"
          : "auto auto minmax(0,1fr)",
    "--timeline-content-align": vertical && oddBefore ? "end" : "start",
    "--timeline-content-align-even": vertical && evenBefore ? "end" : "start",
    "--timeline-opposite-align": vertical && !oddBefore ? "end" : "start",
    "--timeline-opposite-align-even": vertical && !evenBefore ? "end" : "start",
  } as React.CSSProperties
}

/**
 * A sequence of events in order: an ordered list whose items each draw a marker on a line, their content on one side
 * and, optionally, opposite content (a time, a date) on the other.
 *
 * @since 0.1.1
 */
function Timeline({
  className,
  style,
  align = "start",
  orientation = "vertical",
  ...props
}: React.ComponentProps<"ol"> & {
  /**
   * The side of the line the content takes: `start` puts it after the line (to the right in a left-to-right page, below
   * a horizontal line), `end` before it, `alternate` switches side on every event.
   */
  align?: TimelineAlign
  /** `vertical` runs the events down the page; `horizontal` runs them across it. */
  orientation?: TimelineOrientation
}) {
  return (
    <ol
      data-slot="timeline"
      data-align={align}
      data-orientation={orientation}
      style={{ ...layoutVariables(orientation, align), ...style }}
      className={cn(
        "group/timeline m-0 flex list-none p-0 data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

/** One event of a `Timeline`: a list item holding its separator, content and opposite content. @since 0.1.1 */
function TimelineItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="timeline-item"
      className={cn(
        "group/timeline-item relative m-0 grid [grid-template-areas:var(--timeline-areas)] even:[grid-template-areas:var(--timeline-areas-even)]",
        // Down the page each event is at least 4.5rem tall, the last one as tall as its content; across it the events
        // share the width and the last one keeps its own.
        "group-data-[orientation=vertical]/timeline:min-h-18 group-data-[orientation=vertical]/timeline:[grid-template-columns:var(--timeline-tracks)] group-data-[orientation=vertical]/timeline:last:min-h-0",
        "group-data-[orientation=horizontal]/timeline:flex-1 group-data-[orientation=horizontal]/timeline:[grid-template-rows:var(--timeline-tracks)] group-data-[orientation=horizontal]/timeline:last:flex-none",
        // When any event has opposite content, both sides share the width equally, so every marker sits on one line.
        "group-has-data-[slot=timeline-opposite]/timeline:[--timeline-tracks:minmax(0,1fr)_auto_minmax(0,1fr)]",
        className
      )}
      {...props}
    />
  )
}

/**
 * The line of an event: its marker and the connector to the next event. Without children it draws the default marker
 * and connector. Hidden from assistive technology: say in the content what a coloured or iconic marker means.
 *
 * @since 0.1.1
 */
function TimelineSeparator({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="timeline-separator"
      className={cn(
        "flex items-center [grid-area:separator] group-data-[orientation=horizontal]/timeline:flex-row group-data-[orientation=vertical]/timeline:flex-col",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <TimelineMarker />
          <TimelineConnector />
        </>
      )}
    </div>
  )
}

/**
 * The point on the line: a 16 px ring with a dot in the primary colour, or what you put inside it (an icon, an avatar),
 * sized and coloured with `className`.
 *
 * @since 0.1.1
 */
function TimelineMarker({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="timeline-marker"
      className={cn(
        // A 16 px ring of the content edge on the card surface, with a faint shadow; empty, it holds a 6 px dot in the
        // primary colour. Down the page it sits 2 px low, centred on the first 21 px line of 14 px content.
        "relative inline-flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card shadow-[0_0.5px_0_0_rgb(0_0_0/0.06),0_1px_1px_0_rgb(0_0_0/0.12)] group-data-[orientation=vertical]/timeline:mt-0.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        "empty:before:size-1.5 empty:before:rounded-full empty:before:bg-primary",
        className
      )}
      {...props}
    />
  )
}

/** The 2 px line from an event's marker to the next one; not drawn after the last event. @since 0.1.1 */
function TimelineConnector({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="timeline-connector"
      className={cn(
        "flex-1 bg-border group-last/timeline-item:hidden group-data-[orientation=horizontal]/timeline:h-0.5 group-data-[orientation=vertical]/timeline:w-0.5",
        className
      )}
      {...props}
    />
  )
}

/** What happened: the event's main content, on the side `align` gives it. @since 0.1.1 */
function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-content"
      className={cn(
        "min-w-0 text-sm/normal [grid-area:content] [text-align:var(--timeline-content-align)] group-even/timeline-item:[text-align:var(--timeline-content-align-even)]",
        // 0.875rem from the line; down the page, 1.5rem below tall content before the next event; across it, 1rem
        // before the next event, so text that wraps never runs into its neighbour's.
        "group-data-[orientation=horizontal]/timeline:py-3.5 group-data-[orientation=horizontal]/timeline:pe-4 group-data-[orientation=horizontal]/timeline:group-last/timeline-item:pe-0 group-data-[orientation=vertical]/timeline:px-3.5 group-data-[orientation=vertical]/timeline:pb-6 group-data-[orientation=vertical]/timeline:group-last/timeline-item:pb-0",
        className
      )}
      {...props}
    />
  )
}

/**
 * What goes on the other side of the line, such as the event's time. When any event has it, the line moves to the
 * middle.
 *
 * @since 0.1.1
 */
function TimelineOpposite({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-opposite"
      className={cn(
        "min-w-0 text-sm/normal text-muted-foreground [grid-area:opposite] [text-align:var(--timeline-opposite-align)] group-even/timeline-item:[text-align:var(--timeline-opposite-align-even)]",
        "group-data-[orientation=horizontal]/timeline:py-3.5 group-data-[orientation=horizontal]/timeline:pe-4 group-data-[orientation=horizontal]/timeline:group-last/timeline-item:pe-0 group-data-[orientation=vertical]/timeline:px-3.5 group-data-[orientation=vertical]/timeline:pb-6 group-data-[orientation=vertical]/timeline:group-last/timeline-item:pb-0",
        className
      )}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineMarker,
  TimelineConnector,
  TimelineContent,
  TimelineOpposite,
}
export type { TimelineAlign, TimelineOrientation }
