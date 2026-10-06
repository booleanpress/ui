import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@booleanpress/ui/carousel"

export default function CarouselArrows() {
  return (
    <Carousel aria-label="Numbered slides" className="mx-auto w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }, (_, index) => (
          <CarouselItem key={index}>
            <div className="flex aspect-square items-center justify-center rounded-xl border bg-subtle text-5xl font-semibold text-primary">
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
