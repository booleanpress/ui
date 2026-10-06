import { Button } from "@booleanpress/ui/button"
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@booleanpress/ui/dialog"

export default function DialogMaximizable() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Preview the email</Button>
      </DialogTrigger>
      <DialogContent size="lg" maximizable>
        <DialogHeader>
          <DialogTitle>Email preview</DialogTitle>
          <DialogDescription>Sent on 12 October 2026 · 3 recipients</DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-3 text-sm/normal">
          <h3 className="text-xl/normal font-semibold">Your October delivery report</h3>
          <p>
            Every email your site sent this month reached the mail server. Two bounced because the address no longer
            exists; both are now on the suppression list, so no further email goes to them.
          </p>
          <p>
            Open rates held steady at 41&nbsp;%, and the weekly digest remains your most read message. Delivery took under two
            seconds on average, with no retries needed after the 4 October maintenance window.
          </p>
          <p>
            Next month, the new routing rules send transactional email through the primary mailer and newsletters through
            the backup, so a large campaign never delays a password reset.
          </p>
        </DialogBody>
        <DialogFooter className="text-sm text-muted-foreground sm:justify-between">
          <span>Last updated 12 October 2026</span>
          <span>From: reports@example.com</span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
