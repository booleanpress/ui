import * as React from "react"
import { SendIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Checkbox } from "@booleanpress/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"
import { PageHeader, PageHeaderDescription, PageHeaderHeading, PageHeaderTitle } from "@booleanpress/ui/page-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"
import { Switch } from "@booleanpress/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"

const PAGES = ["Overview", "Email log", "Mailers", "Settings"]
// The panels stay mounted, so a change survives a switch of tab; the inactive ones are only hidden.
const panel = "px-0 pt-6 data-[state=inactive]:hidden"

/** A label with its description on the start side, the control on the end side from a medium width up. */
function Row({ id, label, help, children }: { id: string; label: string; help: string; children: React.ReactNode }) {
  return (
    <Field orientation="responsive">
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <FieldDescription id={`${id}-help`}>{help}</FieldDescription>
      </FieldContent>
      <div className="@md/field-group:min-w-64">{children}</div>
    </Field>
  )
}

export default function SettingsPageBlock() {
  // Changing the key mounts the form again, so Discard puts every field back to its saved value.
  const [version, setVersion] = React.useState(0)
  const [dirty, setDirty] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const change = () => {
    setDirty(true)
    setSaved(false)
  }

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    // Your save request goes here, with new FormData(event.currentTarget); a fixed delay stands in for it.
    window.setTimeout(() => {
      setSaving(false)
      setDirty(false)
      setSaved(true)
    }, 800)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <p className="flex items-center gap-2 font-semibold">
            <SendIcon className="size-4" aria-hidden="true" />
            Acme
          </p>
          <nav aria-label="Acme">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {PAGES.map((page) => (
                <li key={page}>
                  <a
                    href={`#${page.toLowerCase().replace(" ", "-")}`}
                    aria-current={page === "Settings" ? "page" : undefined}
                    className="rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=page]:font-medium aria-[current=page]:text-foreground"
                  >
                    {page}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader>
          <PageHeaderHeading>
            <PageHeaderTitle>Settings</PageHeaderTitle>
          </PageHeaderHeading>
          <PageHeaderDescription>How Acme sends, keeps and reports your site&apos;s email.</PageHeaderDescription>
        </PageHeader>

        <form key={version} id="settings" onSubmit={save} onChange={change}>
          <Tabs defaultValue="sending" className="mt-6">
            <TabsList variant="line" aria-label="Settings sections">
              <TabsTrigger value="sending">Sending</TabsTrigger>
              <TabsTrigger value="logging">Logging</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="sending" forceMount className={panel}>
              <FieldSet>
                <FieldLegend>Sender</FieldLegend>
                <FieldDescription>Who your site&apos;s email comes from.</FieldDescription>
                <FieldGroup>
                  <Row id="from-name" label="From name" help="Shown in the recipient's inbox.">
                    <Input id="from-name" name="fromName" defaultValue="Northwind Coffee" aria-describedby="from-name-help" />
                  </Row>
                  <Row id="from-email" label="From email" help="A verified address of your domain.">
                    <Input id="from-email" name="fromEmail" type="email" defaultValue="hello@northwind.example" aria-describedby="from-email-help" />
                  </Row>
                  <Field orientation="horizontal">
                    <Switch id="force-from" name="forceFrom" defaultChecked onCheckedChange={change} aria-describedby="force-from-help" />
                    <FieldContent>
                      <FieldLabel htmlFor="force-from">Use this sender for every email</FieldLabel>
                      <FieldDescription id="force-from-help">Plugins that set their own sender are overruled.</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSeparator className="my-8" />
              <FieldSet>
                <FieldLegend>Mailers</FieldLegend>
                <FieldDescription>The services that deliver it, in the order they are tried.</FieldDescription>
                <FieldGroup>
                  <Row id="primary-mailer" label="Primary mailer" help="Sends every email first.">
                    <Select name="primaryMailer" defaultValue="ses" onValueChange={change}>
                      <SelectTrigger id="primary-mailer" aria-describedby="primary-mailer-help" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                        <SelectItem value="postmark">Postmark</SelectItem>
                        <SelectItem value="smtp">Other SMTP server</SelectItem>
                      </SelectContent>
                    </Select>
                  </Row>
                  <Row id="fallback-mailer" label="Fallback mailer" help="Takes over when the primary fails.">
                    <Select name="fallbackMailer" defaultValue="postmark" onValueChange={change}>
                      <SelectTrigger id="fallback-mailer" aria-describedby="fallback-mailer-help" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="postmark">Postmark</SelectItem>
                        <SelectItem value="smtp">Other SMTP server</SelectItem>
                      </SelectContent>
                    </Select>
                  </Row>
                </FieldGroup>
              </FieldSet>
            </TabsContent>

            <TabsContent value="logging" forceMount className={panel}>
              <FieldSet>
                <FieldLegend>Email log</FieldLegend>
                <FieldDescription>A record of every email, for finding one that went missing.</FieldDescription>
                <FieldGroup>
                  <Field orientation="horizontal">
                    <Switch id="keep-log" name="keepLog" defaultChecked onCheckedChange={change} />
                    <FieldLabel htmlFor="keep-log">Keep a log of every email</FieldLabel>
                  </Field>
                  <Row id="retention" label="Delete entries after" help="Older entries are deleted every night.">
                    <Select name="retention" defaultValue="30" onValueChange={change}>
                      <SelectTrigger id="retention" aria-describedby="retention-help" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </Row>
                  <Field orientation="horizontal">
                    <Checkbox id="keep-body" name="keepBody" onCheckedChange={change} />
                    <FieldLabel htmlFor="keep-body">Keep the body of each email too</FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </TabsContent>

            <TabsContent value="alerts" forceMount className={panel}>
              <FieldSet>
                <FieldLegend>Alerts</FieldLegend>
                <FieldDescription>Email about delivery problems, sent through the fallback mailer.</FieldDescription>
                <FieldGroup>
                  <Row id="alert-to" label="Send alerts to" help="One address; use a shared inbox for a team.">
                    <Input id="alert-to" name="alertTo" type="email" defaultValue="ops@northwind.example" aria-describedby="alert-to-help" />
                  </Row>
                  <Field orientation="horizontal">
                    <Checkbox id="alert-failed" name="alertFailed" defaultChecked onCheckedChange={change} />
                    <FieldLabel htmlFor="alert-failed">When an email cannot be delivered</FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox id="alert-weekly" name="alertWeekly" onCheckedChange={change} />
                    <FieldLabel htmlFor="alert-weekly">A summary every Monday</FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </TabsContent>
          </Tabs>
        </form>
      </main>

      <section aria-label="Save changes" className="sticky bottom-0 border-t bg-background">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-end gap-2 px-4 py-3 sm:px-6">
          <p role="status" className="me-auto text-sm text-muted-foreground">
            {dirty ? "You have unsaved changes." : saved ? "Your changes are saved." : "No unsaved changes."}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={!dirty || saving}
            onClick={() => {
              setVersion(version + 1)
              setDirty(false)
            }}
          >
            Discard
          </Button>
          <Button type="submit" form="settings" loading={saving} disabled={!dirty}>
            Save changes
          </Button>
        </div>
      </section>
    </div>
  )
}
