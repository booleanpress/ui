import { Button } from "@booleanpress/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@booleanpress/ui/dialog"

const SECTIONS = [
  ["1. Who the service is for", "The service sends email on behalf of the sites you connect. You may connect sites you own or manage for a client who has agreed to it."],
  ["2. What you may send", "Transactional email and newsletters to people who asked for them. Bought or rented lists are not allowed, and neither is email that hides who sent it."],
  ["3. Delivery", "Email is handed to the mail server within seconds. A message that cannot be delivered is retried for up to 24 hours, then reported in the log."],
  ["4. Bounces and complaints", "Addresses that bounce or complain are suppressed automatically. A complaint rate above 0.3\u00a0% pauses sending until you review the list."],
  ["5. Your data", "Logs keep the recipient, subject and status of each email for 30 days. Message bodies are never stored unless you turn on full logging."],
  ["6. Limits", "Each plan has a monthly allowance. Email above it is queued until the next month or until you raise the plan."],
  ["7. Changes", "We tell you about changes to these terms 30 days before they apply, by email to the account owner."],
]

export default function DialogOutsideScroll() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Read the sending terms</Button>
      </DialogTrigger>
      <DialogContent scroll="outside" size="lg">
        <DialogHeader>
          <DialogTitle>Sending terms</DialogTitle>
          <DialogDescription>Last revised on 1 October 2026.</DialogDescription>
        </DialogHeader>
        {SECTIONS.map(([heading, text]) => (
          <section key={heading} className="flex flex-col gap-2 text-sm/normal">
            <h3 className="text-base/normal font-semibold">{heading}</h3>
            <p className="text-muted-foreground">{text}</p>
            <p className="text-muted-foreground">{text}</p>
          </section>
        ))}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Decline</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Accept</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
