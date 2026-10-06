import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselFooter,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@booleanpress/ui/carousel"

export default function CarouselBasic() {
  return (
    <Carousel aria-label="Numbered slides" className="mx-auto w-full max-w-xl">
      <CarouselContent>
        {Array.from({ length: 5 }, (_, index) => (
          <CarouselItem key={index}>
            <div className="flex h-60 items-center justify-center rounded-xl border bg-subtle text-5xl font-semibold text-primary">
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
