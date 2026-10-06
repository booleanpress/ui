import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@booleanpress/ui/carousel"

export default function CarouselVertical() {
  return (
    <Carousel aria-label="Numbered slides" orientation="vertical" opts={{ align: "start" }} className="mx-auto my-12 w-full max-w-sm">
      <CarouselContent className="h-60">
        {Array.from({ length: 5 }, (_, index) => (
          <CarouselItem key={index} className="basis-3/4">
            <div className="flex h-full items-center justify-center rounded-xl border bg-subtle text-5xl font-semibold text-primary">
              {index + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
