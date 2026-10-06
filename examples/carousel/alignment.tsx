import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselFooter,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@booleanpress/ui/carousel"

export default function CarouselAlignment() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
      {(["start", "center"] as const).map((align) => (
        <Carousel key={align} aria-label={`Slides aligned to the ${align}`} opts={{ align, containScroll: false }}>
          <CarouselContent>
            {Array.from({ length: 5 }, (_, index) => (
              <CarouselItem key={index} className="basis-2/3">
                <div className="flex h-40 items-center justify-center rounded-xl border bg-subtle text-5xl font-semibold text-primary">
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
      ))}
    </div>
  )
}
