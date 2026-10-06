import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselFooter,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@booleanpress/ui/carousel"

const MAILERS = [
  { name: "Primary", provider: "Amazon SES", sent: "12,480" },
  { name: "Backup", provider: "SMTP relay", sent: "312" },
  { name: "Marketing", provider: "Mailgun", sent: "48,920" },
  { name: "Receipts", provider: "Postmark", sent: "7,105" },
  { name: "Alerts", provider: "SendGrid", sent: "1,264" },
  { name: "Staging", provider: "Mailpit", sent: "88" },
]

export default function CarouselSeveralPerView() {
  return (
    <Carousel aria-label="Mailers" opts={{ align: "start", slidesToScroll: "auto" }} className="mx-auto w-full max-w-xl">
      <CarouselContent>
        {MAILERS.map((mailer) => (
          <CarouselItem key={mailer.name} className="basis-1/2 sm:basis-1/3">
            <div className="flex flex-col gap-1 rounded-xl border bg-card p-4 shadow-sm">
              <p className="text-sm/normal font-semibold">{mailer.name}</p>
              <p className="text-xs/normal text-muted-foreground">{mailer.provider}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{mailer.sent}</p>
              <p className="text-xs/normal text-muted-foreground">sent in October</p>
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
