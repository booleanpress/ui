import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@booleanpress/ui/combobox"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@booleanpress/ui/dialog"
import { Label } from "@booleanpress/ui/label"

const MAILERS = ["Amazon SES", "Brevo", "Mailgun", "Mailjet", "Postmark", "Resend", "SendGrid", "SparkPost"]

export default function ComboboxInDialog() {
  const [mailer, setMailer] = useState<string | null>("Postmark")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Route transactional email</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Route transactional email</DialogTitle>
          <DialogDescription>Receipts and password resets go through this mailer.</DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-2">
          <Label htmlFor="combobox-route">Mailer</Label>
          <Combobox items={MAILERS} value={mailer} onValueChange={setMailer}>
            <ComboboxInput id="combobox-route" placeholder="Search mailers" />
            <ComboboxContent>
              <ComboboxEmpty />
              <ComboboxList>
                {(name: string) => (
                  <ComboboxItem key={name} value={name}>
                    {name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button disabled={!mailer}>Save route</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
