import type { ComponentDoc } from "../types.ts"

export default {
  slug: "carousel",
  title: "Carousel",
  category: "Media",
  purpose: "Slides that scroll along one axis, moved by swipe, by the previous and next buttons, by dots or by the arrow keys.",
  links: {
    apg: { label: "APG Carousel", href: "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/" },
    spec: "specs/004_full-suite-components.md#carousel",
  },
  peers: ["embla-carousel-react"],
  usage: `\`\`\`tsx
<Carousel aria-label="October reports" className="w-full max-w-xl">
  <CarouselContent>
    <CarouselItem>Deliveries</CarouselItem>
    <CarouselItem>Bounces</CarouselItem>
    <CarouselItem>Complaints</CarouselItem>
  </CarouselContent>
  <CarouselFooter>
    <CarouselDots />
    <div className="flex gap-2">
      <CarouselPrevious />
      <CarouselNext />
    </div>
  </CarouselFooter>
</Carousel>
\`\`\``,
  examples: [
    {
      id: "basic",
      title: "Basic",
      description: "One slide at a time, with dots and previous and next buttons underneath.",
    },
    {
      id: "alignment",
      title: "Alignment",
      description: "`opts={{ align }}` lines the current slide up at the start, or centres it.",
    },
    {
      id: "vertical",
      title: "Vertical",
      description: "`orientation=\"vertical\"` scrolls up and down.",
    },
    {
      id: "loop",
      title: "Loop",
      description: "`opts={{ loop: true }}` goes from the last slide back to the first.",
    },
    {
      id: "variable-size",
      title: "Variable size",
      description: "Slides take the width of their content.",
    },
    {
      id: "dots",
      title: "Dots",
      description: "Dots alone under the slides, the current one filled.",
    },
    {
      id: "several-per-view",
      title: "Several per view",
      description: "Several slides show at once and move a page at a time.",
    },
    {
      id: "arrows",
      title: "Arrows beside the slides",
      description: "The previous and next buttons sit at the edges of the slides.",
    },
  ],
  accessibility: {
    semantics:
      'A `role="region"` described as a carousel; each slide is a `role="group"` named by its position, such as "Slide 2 of 5".',
    labels:
      "Name the carousel with `aria-label`, as any region. Give a slide its own `aria-label` to replace its position name.",
    focus:
      "The carousel is not a tab stop; its buttons, dots and the controls in its slides are. While focus is inside, the arrow keys move one slide.",
    limits: [
      "There is no autoplay built in. Embla's autoplay plugin works through `plugins`; if you add it, also add a visible pause button, as WCAG 2.2.2 asks.",
      "Each dot is a 28 × 8 px bar whose target is 24 px tall; dots 8 px apart meet WCAG 2.5.8.",
      "The arrow keys do nothing while focus is in a text field inside a slide, or in a control that uses them itself (a radio group, a slider, tabs), so the control keeps them.",
    ],
  },
  keyboard: [
    { keys: ["ArrowRight"], behaviour: "With focus inside a horizontal carousel, moves to the next slide (the previous one in right-to-left)." },
    { keys: ["ArrowLeft"], behaviour: "With focus inside a horizontal carousel, moves to the previous slide (the next one in right-to-left)." },
    { keys: ["ArrowDown"], behaviour: "With focus inside a vertical carousel, moves to the next slide." },
    { keys: ["ArrowUp"], behaviour: "With focus inside a vertical carousel, moves to the previous slide." },
    { keys: ["Enter", "Space"], behaviour: "On a button, moves to the previous or next slide; on a dot, moves to its position." },
  ],
  theming:
    "Slides carry no surface of their own: style what you put in them. The previous and next buttons are outline icon buttons: `--border` for the edge, `--muted-foreground` for the chevron and `--subtle` under the pointer. The dots are `--border`, `--control` under the pointer and `--primary` for the current one; focus is the `--ring` outline.",
  props: {
    Carousel: {
      opts: "Embla's options: `align`, `loop`, `slidesToScroll`, `dragFree`, `startIndex` and the rest. `axis` and `direction` come from `orientation` and the provider.",
      plugins: "Embla plugins, such as `embla-carousel-autoplay`.",
      orientation: "`horizontal` (the default) or `vertical`. A vertical carousel needs a height on `CarouselContent`.",
      setApi: "Receives Embla's API once it is ready.",
    },
    CarouselPrevious: {
      variant: "The button's variant. `outline` by default.",
      size: "The button's size. `icon` (36 px) by default.",
    },
    CarouselNext: {
      variant: "The button's variant. `outline` by default.",
      size: "The button's size. `icon` (36 px) by default.",
    },
  },
} satisfies ComponentDoc
