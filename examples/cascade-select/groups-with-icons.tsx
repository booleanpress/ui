import {
  KeyRoundIcon,
  LogInIcon,
  MailCheckIcon,
  MailIcon,
  MailOpenIcon,
  MailXIcon,
  SendIcon,
  TriangleAlertIcon,
  UserIcon,
  WebhookIcon,
} from "lucide-react"
import { CascadeSelect, type CascadeSelectOption } from "@booleanpress/ui/cascade-select"
import { Label } from "@booleanpress/ui/label"

const EVENTS: CascadeSelectOption[] = [
  {
    value: "email",
    label: "Email",
    icon: <MailIcon />,
    children: [
      { value: "email-delivered", label: "Delivered", icon: <MailCheckIcon /> },
      { value: "email-opened", label: "Opened", icon: <MailOpenIcon /> },
      { value: "email-bounced", label: "Bounced", icon: <MailXIcon /> },
    ],
  },
  {
    value: "webhook",
    label: "Webhook",
    icon: <WebhookIcon />,
    children: [
      { value: "webhook-sent", label: "Sent", icon: <SendIcon /> },
      { value: "webhook-failed", label: "Failed", icon: <TriangleAlertIcon /> },
    ],
  },
  {
    value: "account",
    label: "Account",
    icon: <UserIcon />,
    children: [
      { value: "account-sign-in", label: "Signed in", icon: <LogInIcon /> },
      { value: "account-password", label: "Password changed", icon: <KeyRoundIcon /> },
    ],
  },
]

export default function CascadeSelectGroupsWithIcons() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="alert-event">Alert on</Label>
      <CascadeSelect id="alert-event" options={EVENTS} placeholder="Choose an event" className="w-full" />
    </div>
  )
}
