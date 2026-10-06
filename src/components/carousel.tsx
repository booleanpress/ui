"use client"

import * as React from "react"
import { cn, fillString } from "@/lib/utils"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
// boolean-ui patch: chevrons, the visual target's glyph, and up and down ones for a vertical carousel (stock:
// ArrowLeft and ArrowRight, the whole button turned 90° when vertical).
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react"

import { Button } from "@/components/button"
import { useUiConfig, useUiStrings } from "@booleanpress/ui/provider"

/** @since 0.1.0 */
type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  /** Embla's options: `align`, `loop`, `slidesToScroll`, `dragFree` and the rest. */
  opts?: CarouselOptions
  /** Embla plugins, such as autoplay. */
  plugins?: CarouselPlugin
  /** The axis the slides move along. A vertical carousel needs a height on `CarouselContent`. */
  orientation?: "horizontal" | "vertical"
  /** Receives Embla's API once it is ready, to read or drive the carousel from outside. */
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

// boolean-ui patch: the buttons inside `CarouselFooter` sit in its row instead of outside the slides.
const CarouselFooterContext = React.createContext(false)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

// boolean-ui patch: the arrow keys leave text fields inside a slide alone.
function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  )
}

/**
 * Slides that scroll along one axis, built on Embla. Arrow keys move one slide while focus is inside it.
 *
 * @since 0.1.0
 */
function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  onKeyDown,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const { dir } = useUiConfig()
  const strings = useUiStrings()
  const [carouselRef, api] = useEmblaCarousel(
    {
      // boolean-ui patch: Embla scrolls the other way in a right-to-left page; it is told the provider's direction.
      direction: orientation === "horizontal" ? dir : "ltr",
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  // boolean-ui patch: whether each button can scroll is read from Embla's events with useSyncExternalStore (stock set
  // state from an effect, which the React Compiler's lint rejects).
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!api) return () => {}
      api.on("reInit", onChange)
      api.on("select", onChange)
      return () => {
        api.off("reInit", onChange)
        api.off("select", onChange)
      }
    },
    [api]
  )
  const canScrollPrev = React.useSyncExternalStore(subscribe, () => api?.canScrollPrev() ?? false, () => false)
  const canScrollNext = React.useSyncExternalStore(subscribe, () => api?.canScrollNext() ?? false, () => false)

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  // boolean-ui patch: Up and Down move a vertical carousel, and Left and Right swap in a right-to-left page; the keys
  // are read as they bubble, so a control inside a slide that uses them (a radio group, a slider, tabs) keeps them by
  // handling them first (stock: Left and Right only, whatever the orientation and direction, taken in the capture
  // phase before any control inside).
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || isEditable(event.target)) return
      const vertical = orientation === "vertical"
      const rtl = dir === "rtl"
      const previousKey = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft"
      const nextKey = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight"
      if (event.key === previousKey) {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === nextKey) {
        event.preventDefault()
        scrollNext()
      }
    },
    [onKeyDown, orientation, dir, scrollPrev, scrollNext]
  )

  // boolean-ui patch: Previous and Next disable at the ends, and a disabled button cannot keep focus. When the one that
  // has focus disables, focus moves to the other, so it never falls to the page (stock: it fell to the page).
  React.useLayoutEffect(() => {
    const root = api?.rootNode().closest('[data-slot="carousel"]')
    const focused = typeof document === "undefined" ? null : document.activeElement
    if (!root || !(focused instanceof HTMLButtonElement) || !focused.disabled || !root.contains(focused)) return
    const other =
      focused.dataset.slot === "carousel-next"
        ? "carousel-previous"
        : focused.dataset.slot === "carousel-previous"
          ? "carousel-next"
          : null
    if (other) root.querySelector<HTMLElement>(`[data-slot="${other}"]:not(:disabled)`)?.focus()
  }, [api, canScrollPrev, canScrollNext])

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDown={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        // boolean-ui patch: the role description comes from the provider (stock: "carousel").
        aria-roledescription={strings.carouselRole}
        data-slot="carousel"
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

/** @since 0.1.0 */
function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        // boolean-ui patch: a logical margin for right-to-left pages (stock: -ml-4).
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ms-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

/**
 * One slide. Its accessible name is its position, "Slide 2 of 5", unless you give it `aria-label`.
 *
 * @since 0.1.0
 */
function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { api, orientation } = useCarousel()
  const strings = useUiStrings()
  const ref = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState<{ index: number; count: number } | null>(null)

  // boolean-ui patch: each slide is named by its position among its siblings, kept current when slides change.
  React.useLayoutEffect(() => {
    const update = () => {
      const node = ref.current
      const siblings = node?.parentElement
        ? Array.from(node.parentElement.children).filter((el) => el.getAttribute("data-slot") === "carousel-item")
        : []
      if (!node) return
      const index = siblings.indexOf(node) + 1
      setPosition((current) =>
        current?.index === index && current.count === siblings.length ? current : { index, count: siblings.length }
      )
    }
    update()
    api?.on("slidesChanged", update)
    api?.on("reInit", update)
    return () => {
      api?.off("slidesChanged", update)
      api?.off("reInit", update)
    }
  }, [api])

  return (
    <div
      ref={ref}
      role="group"
      // boolean-ui patch: the role description and the position come from the provider (stock: "slide", no name).
      aria-roledescription={strings.slideRole}
      aria-label={position ? fillString(strings.slideOf, position) : undefined}
      data-slot="carousel-item"
      // boolean-ui patch: a logical padding for right-to-left pages (stock: pl-4).
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "ps-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

// boolean-ui patch: the visual target's arrow buttons — 36 px, round, an outline in muted grey with a 16 px chevron
// (stock: 32 px). Outside the footer they sit beside the slides at the logical edges, so a right-to-left page puts
// Previous on the right (stock: left and right).
const arrowButtonClass =
  "rounded-full text-muted-foreground hover:text-foreground [&_svg:not([class*='size-'])]:size-4"

/** @since 0.1.0 */
function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()
  const inFooter = React.useContext(CarouselFooterContext)
  const strings = useUiStrings()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        arrowButtonClass,
        !inFooter && "absolute",
        !inFooter &&
          (orientation === "horizontal"
            ? "top-1/2 -start-12 -translate-y-1/2"
            : "-top-12 start-1/2 -translate-x-1/2 rtl:translate-x-1/2"),
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      {orientation === "horizontal" ? <ChevronLeftIcon className="rtl:rotate-180" /> : <ChevronUpIcon />}
      {/* boolean-ui patch: the name comes from the provider (stock: "Previous slide"). */}
      <span className="sr-only">{strings.previousSlide}</span>
    </Button>
  )
}

/** @since 0.1.0 */
function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  const inFooter = React.useContext(CarouselFooterContext)
  const strings = useUiStrings()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        arrowButtonClass,
        !inFooter && "absolute",
        !inFooter &&
          (orientation === "horizontal"
            ? "top-1/2 -end-12 -translate-y-1/2"
            : "-bottom-12 start-1/2 -translate-x-1/2 rtl:translate-x-1/2"),
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      {orientation === "horizontal" ? <ChevronRightIcon className="rtl:rotate-180" /> : <ChevronDownIcon />}
      {/* boolean-ui patch: the name comes from the provider (stock: "Next slide"). */}
      <span className="sr-only">{strings.nextSlide}</span>
    </Button>
  )
}

/**
 * A row under the slides: put `CarouselDots` at its start and the previous and next buttons at its end, as the
 * visual target lays them out.
 *
 * @since 0.1.0
 */
// boolean-ui patch: new part.
function CarouselFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <CarouselFooterContext.Provider value={true}>
      <div
        data-slot="carousel-footer"
        className={cn("mt-4 flex items-center justify-between gap-4", className)}
        {...props}
      />
    </CarouselFooterContext.Provider>
  )
}

/**
 * One bar per scroll position; the current one is filled. Each is a button named "Go to slide 2".
 *
 * @since 0.1.0
 */
// boolean-ui patch: new part, the visual target's indicators.
function CarouselDots({ className, ...props }: React.ComponentProps<"div">) {
  const { api } = useCarousel()
  const strings = useUiStrings()
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      if (!api) return () => {}
      api.on("reInit", onChange)
      api.on("select", onChange)
      return () => {
        api.off("reInit", onChange)
        api.off("select", onChange)
      }
    },
    [api]
  )
  const count = React.useSyncExternalStore(subscribe, () => api?.scrollSnapList().length ?? 0, () => 0)
  const selected = React.useSyncExternalStore(subscribe, () => api?.selectedScrollSnap() ?? 0, () => 0)

  return (
    <div
      data-slot="carousel-dots"
      className={cn("flex flex-wrap items-center justify-center gap-2 p-4", className)}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          data-slot="carousel-dot"
          data-active={index === selected || undefined}
          aria-current={index === selected ? "true" : undefined}
          onClick={() => api?.scrollTo(index)}
          // A 28 × 8 px bar whose target reaches 24 px tall through its ::after.
          className="relative h-2 w-7 rounded-md bg-border transition-[background-color,outline-color] duration-(--bui-duration-control) outline-none after:absolute after:inset-x-0 after:-inset-y-2 hover:bg-control focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid data-active:bg-primary"
        >
          <span className="sr-only">{fillString(strings.goToSlide, { index: index + 1 })}</span>
        </button>
      ))}
    </div>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselFooter,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
}
