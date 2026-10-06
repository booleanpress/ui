import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselFooter,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@booleanpress/ui/carousel"

const WIDTHS = ["w-30", "w-20", "w-50", "w-40", "w-55", "w-45", "w-70", "w-25"]

export default function CarouselVariableSize() {
  return (
    <Carousel aria-label="Slides of different widths" opts={{ align: "start" }} className="mx-auto w-full max-w-xl">
      <CarouselContent>
        {WIDTHS.map((width, index) => (
          <CarouselItem key={width} className="basis-auto">
            <div
              className={`flex h-35 ${width} items-center justify-center rounded-xl border bg-subtle text-4xl font-semibold text-primary`}
            >
              {index + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselFooter>
        <CarouselDots />
        <div className="flex gap-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </CarouselFooter>
    </Carousel>
  )
}
