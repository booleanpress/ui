import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@booleanpress/ui/carousel"

const TIPS = [
  { title: "Verify your domain", text: "Add the SPF and DKIM records so mailbox providers trust your mail." },
  { title: "Send a test email", text: "Check the delivery log for the result before you go live." },
  { title: "Turn on alerts", text: "Hear about bounces and failed sends as they happen." },
]

export default function CarouselDotsExample() {
  return (
    <Carousel aria-label="Getting started" className="mx-auto w-full max-w-sm">
      <CarouselContent>
        {TIPS.map((tip) => (
          <CarouselItem key={tip.title}>
            <div className="flex h-40 flex-col justify-center gap-1 rounded-xl border bg-card p-6 shadow-sm">
              <p className="text-base/normal font-semibold">{tip.title}</p>
              <p className="text-sm/normal text-muted-foreground">{tip.text}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselDots />
    </Carousel>
  )
}
