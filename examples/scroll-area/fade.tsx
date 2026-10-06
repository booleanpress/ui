import { ScrollArea } from "@booleanpress/ui/scroll-area"

const MAILERS = [
  ["Amazon SES", 4820],
  ["Postmark", 2194],
  ["SendGrid", 1837],
  ["Mailgun", 1280],
  ["Brevo", 961],
  ["SMTP relay", 624],
  ["Resend", 498],
  ["Sendmail", 130],
  ["Backup relay", 86],
  ["Elastic Email", 75],
  ["SparkPost", 61],
  ["Mailjet", 44],
  ["Test mailer", 12],
] as const

export default function ScrollAreaFade() {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Mailers</h4>
      <ScrollArea fade className="h-72 w-56 rounded-md border">
        <ul className="flex flex-col gap-2 p-4">
          {MAILERS.map(([name, sent]) => (
            <li key={name} className="flex items-baseline gap-1.5 text-sm">
              {name}
              <span className="text-xs text-muted-foreground tabular-nums">({sent})</span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
