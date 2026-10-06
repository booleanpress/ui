import type { GuideDoc } from "../types.ts"

export default {
  slug: "forms",
  title: "Forms",
  description: "Build forms from the Field parts and the controls: labels, descriptions, errors, required fields, focus and server errors, with recipes for React Hook Form, TanStack Form and plain React.",
  sections: [
    {
      id: "a-field",
      title: "A field",
      markdown: `\`Field\` holds one control with its label, its description and its error. It lays them out and colours them; it does not connect them, so the ids are yours:

\`\`\`tsx
import { Field, FieldDescription, FieldError, FieldLabel } from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"

export function MailerName({ error }: { error?: string }) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="mailer-name">Name</FieldLabel>
      <Input
        id="mailer-name"
        name="name"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "mailer-name-help mailer-name-error" : "mailer-name-help"}
      />
      <FieldDescription id="mailer-name-help">Shown in the list of mailers.</FieldDescription>
      {error && <FieldError id="mailer-name-error">{error}</FieldError>}
    </Field>
  )
}
\`\`\`

- **Label.** \`FieldLabel\`'s \`htmlFor\` is the control's \`id\`. Every control takes it: on a \`Select\` it goes on \`SelectTrigger\`, on a \`DatePicker\` or an \`InputNumber\` on the component itself, which hands it to its text field. A click on the label moves focus to the control, or flips a checkbox or switch.
- **Description.** \`FieldDescription\` says what to enter before anyone gets it wrong: a format, a limit, where the value is used. Tie it to the control with \`aria-describedby\`, so it is read with the name.
- **Groups.** \`FieldGroup\` spaces fields; \`FieldSet\` with a \`FieldLegend\` names a set, such as a radio group or the parts of an address. A checkbox or switch sits beside its label with \`orientation="horizontal"\` and \`FieldContent\`.

Use the controls' own \`size\` and \`variant\` props, or the provider's \`controlSize\` and \`fieldVariant\`, for a compact or filled form: the label and the messages keep their size.`,
    },
    {
      id: "required-fields",
      title: "Required fields",
      markdown: `Say which fields can be left empty, not only which cannot. When most fields are required, add "(optional)" to the label of the others; when most are optional, mark the required ones. A mark must be text that screen readers can read, or the attribute that says it:

- Native fields (\`Input\`, \`Textarea\`, \`NativeSelect\`, \`InputNumber\`, \`DatePicker\`) take \`required\`, which screen readers announce. Put \`noValidate\` on the form so the browser's own bubbles do not replace your messages.
- The other controls take \`aria-required="true"\`: on \`SelectTrigger\`, \`Checkbox\`, \`RadioGroup\`, \`ComboboxInput\`.
- A visual asterisk is \`aria-hidden="true"\` when \`required\` already says it, and needs a line above the form that explains it.

Do not disable the submit button until the form is valid: a disabled button gives no reason, and people cannot find out what is missing. Let them submit, and show the errors.`,
    },
    {
      id: "errors",
      title: "Errors",
      markdown: `Show errors when the form is submitted, and then as each field is corrected. Errors that appear while someone is still typing their first characters only interrupt.

For each field in error:

1. \`aria-invalid="true"\` on the control. Every control draws its \`--invalid\` edge from it, and screen readers announce "invalid".
2. \`data-invalid="true"\` on the \`Field\`, which colours its label.
3. A \`FieldError\` with the message, tied to the control with \`aria-describedby\`. It is a \`role="alert"\` region, so a message that appears is announced. It takes the text as children, or \`errors\`, a list of \`{ message }\` objects as React Hook Form, TanStack Form and Zod give them: it shows one as text and several as a list, without repeats.

Write the message as what to do, in the field's own words: "Enter a full email address, such as hello@example.com", not "Invalid input". Never colour alone: the message and \`aria-invalid\` carry the error.`,
    },
    {
      id: "focus-the-first-error",
      title: "Focus on the first error",
      markdown: `After a submit that fails, move focus to the first field in error. Its name, its value and its message are read together, and keyboard users start where the work is. Do not move focus while someone types.

React Hook Form does this itself (\`shouldFocusError\`, on by default) when each control receives \`field.ref\`; the recipes below show where the ref goes on each control. Elsewhere, focus the first control the browser draws as invalid, once the errors are on the page:

\`\`\`ts
export function focusFirstInvalid(form: HTMLFormElement | null) {
  form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
}
\`\`\`

Every control puts \`aria-invalid\` on its focusable element (the field of a \`DatePicker\` or an \`InputNumber\`, the trigger of a \`Select\`, the box of a \`Checkbox\`), so the query finds the right one.`,
    },
    {
      id: "server-errors",
      title: "Server errors",
      markdown: `Check on the server too: the browser's checks are a convenience, not a guarantee. A server's answer is one of two kinds:

- **About one field** ("This address is not verified for sending"): put it on that field, exactly as a check in the browser would, and focus the field. In React Hook Form, \`form.setError("fromEmail", { type: "server", message }, { shouldFocus: true })\`; in TanStack Form, return \`{ fields: { fromEmail: { message } } }\` from an \`onSubmitAsync\` validator; in plain React, return it in the action's state.
- **About the whole form** ("The mailer could not be saved. Try again."): show it in an \`Alert\` with \`variant="destructive"\` above the submit button. It is a \`role="alert"\` region, so it is read when it appears.

Keep what people typed when a submit fails, and keep the submit button enabled so they can try again. While the request runs, \`Button\`'s \`loading\` shows a spinner in it.`,
    },
    {
      id: "recipes",
      title: "Recipes",
      markdown: `The same form three ways: a mailer's name, sender address, provider, daily limit, open tracking and the terms. The recipes use React Hook Form 7 with Zod 4 (\`react-hook-form\`, \`@hookform/resolvers\`, \`zod\`), TanStack Form 1 (\`@tanstack/react-form\`, \`zod\`), or React 19 alone. None of these packages comes with \`@booleanpress/ui\`: install the ones your recipe uses.`,
      tabs: [
        {
          id: "react-hook-form",
          label: "React Hook Form with Zod",
          markdown: `Each control is wired through \`Controller\`, which hands it \`field\` (the value, the change and blur handlers, the ref) and \`fieldState\` (the error). \`zodResolver\` runs the schema on submit, and again on every change after the first submit. Focus moves to the first field in error on its own, because every control receives \`field.ref\`.

\`\`\`tsx
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Alert, AlertDescription } from "@booleanpress/ui/alert"
import { Button } from "@booleanpress/ui/button"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"
import { InputNumber } from "@booleanpress/ui/input-number"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"
import { Switch } from "@booleanpress/ui/switch"

const mailerSchema = z.object({
  name: z.string().trim().min(1, "Enter a name for the mailer."),
  fromEmail: z.email("Enter a full email address, such as hello@example.com."),
  provider: z.string().min(1, "Choose a provider."),
  dailyLimit: z.number({ error: "Enter a daily limit." }).int().min(1, "Send at least one email a day."),
  trackOpens: z.boolean(),
  terms: z.boolean().refine((accepted) => accepted, "Accept the terms to save the mailer."),
})

type MailerValues = z.infer<typeof mailerSchema>

interface SaveError {
  message?: string
  fields?: Partial<Record<keyof MailerValues, string>>
}

export function MailerForm() {
  const form = useForm<MailerValues>({
    resolver: zodResolver(mailerSchema),
    defaultValues: { name: "", fromEmail: "", provider: "", dailyLimit: 500, trackOpens: true, terms: false },
  })

  async function onSubmit(values: MailerValues) {
    const response = await fetch("/api/mailers", { method: "POST", body: JSON.stringify(values) })
    if (response.ok) return
    const body: SaveError = await response.json()
    const fields = Object.entries(body.fields ?? {}) as [keyof MailerValues, string][]
    fields.forEach(([name, message], index) => form.setError(name, { type: "server", message }, { shouldFocus: index === 0 }))
    if (fields.length === 0) {
      form.setError("root.server", { message: body.message ?? "The mailer could not be saved. Try again." })
    }
  }

  const serverError = form.formState.errors.root?.server?.message

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="mailer-name">Name</FieldLabel>
              <Input
                {...field}
                id="mailer-name"
                required
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? "mailer-name-error" : undefined}
              />
              {fieldState.invalid && <FieldError id="mailer-name-error" errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="fromEmail"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="mailer-from">Send from</FieldLabel>
              <Input
                {...field}
                id="mailer-from"
                type="email"
                autoComplete="email"
                required
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? "mailer-from-help mailer-from-error" : "mailer-from-help"}
              />
              <FieldDescription id="mailer-from-help">The address your recipients see.</FieldDescription>
              {fieldState.invalid && <FieldError id="mailer-from-error" errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="provider"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="mailer-provider">Provider</FieldLabel>
              <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  ref={field.ref}
                  id="mailer-provider"
                  onBlur={field.onBlur}
                  aria-required="true"
                  aria-invalid={fieldState.invalid}
                  aria-describedby={fieldState.invalid ? "mailer-provider-error" : undefined}
                >
                  <SelectValue placeholder="Choose a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ses">Amazon SES</SelectItem>
                  <SelectItem value="postmark">Postmark</SelectItem>
                  <SelectItem value="smtp">Other SMTP server</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError id="mailer-provider-error" errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="dailyLimit"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="mailer-limit">Daily limit</FieldLabel>
              <InputNumber
                id="mailer-limit"
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                min={1}
                required
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? "mailer-limit-error" : undefined}
              />
              {fieldState.invalid && <FieldError id="mailer-limit-error" errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="trackOpens"
          control={form.control}
          render={({ field }) => (
            <Field orientation="horizontal">
              <Switch
                ref={field.ref}
                id="mailer-track"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-describedby="mailer-track-help"
              />
              <FieldContent>
                <FieldLabel htmlFor="mailer-track">Track opens</FieldLabel>
                <FieldDescription id="mailer-track-help">Adds an invisible image to each email.</FieldDescription>
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          name="terms"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                ref={field.ref}
                id="mailer-terms"
                name={field.name}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-required="true"
                aria-invalid={fieldState.invalid}
                aria-describedby={fieldState.invalid ? "mailer-terms-error" : undefined}
              />
              <FieldContent>
                <FieldLabel htmlFor="mailer-terms">I accept the sending terms</FieldLabel>
                {fieldState.invalid && <FieldError id="mailer-terms-error" errors={[fieldState.error]} />}
              </FieldContent>
            </Field>
          )}
        />
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" loading={form.formState.isSubmitting}>
          Save mailer
        </Button>
      </FieldGroup>
    </form>
  )
}
\`\`\`

Every field has a default in \`defaultValues\`, so each control is controlled from the first render. A control that starts empty with \`null\` (a \`DatePicker\`, a \`Combobox\`) can be left out of \`defaultValues\`: pass \`value={field.value ?? null}\`, and the schema's \`z.date({ error: "Choose a start date." })\` turns the empty value into your message.`,
        },
        {
          id: "tanstack-form",
          label: "TanStack Form",
          markdown: `\`form.Field\` hands each control \`field\`: its value in \`field.state.value\`, \`field.handleChange\`, \`field.handleBlur\`, and its errors in \`field.state.meta.errors\`. A Zod schema is a Standard Schema, so \`validators.onSubmit\` takes it as it is, and its issues are \`{ message }\` objects that \`FieldError\` lists. Submitting marks every field as touched, so the errors show; \`onSubmitInvalid\` then moves focus to the first one.

\`\`\`tsx
import { useRef, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Alert, AlertDescription } from "@booleanpress/ui/alert"
import { Button } from "@booleanpress/ui/button"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"
import { InputNumber } from "@booleanpress/ui/input-number"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"
import { Switch } from "@booleanpress/ui/switch"

const mailerSchema = z.object({
  name: z.string().trim().min(1, "Enter a name for the mailer."),
  fromEmail: z.email("Enter a full email address, such as hello@example.com."),
  provider: z.string().min(1, "Choose a provider."),
  dailyLimit: z.number({ error: "Enter a daily limit." }).int().min(1, "Send at least one email a day."),
  trackOpens: z.boolean(),
  terms: z.boolean().refine((accepted) => accepted, "Accept the terms to save the mailer."),
})

export function MailerForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      name: "",
      fromEmail: "",
      provider: "",
      dailyLimit: 500 as number | null,
      trackOpens: true,
      terms: false,
    },
    validators: { onSubmit: mailerSchema },
    onSubmitInvalid: () => {
      // After React has drawn the errors.
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
    },
    onSubmit: async ({ value }) => {
      setServerError(null)
      const response = await fetch("/api/mailers", { method: "POST", body: JSON.stringify(value) })
      if (!response.ok) setServerError("The mailer could not be saved. Try again.")
    },
  })

  return (
    <form
      ref={formRef}
      noValidate
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field
          name="name"
          children={(field) => {
            const invalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor="mailer-name">Name</FieldLabel>
                <Input
                  id="mailer-name"
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  required
                  aria-invalid={invalid}
                  aria-describedby={invalid ? "mailer-name-error" : undefined}
                />
                {invalid && <FieldError id="mailer-name-error" errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="fromEmail"
          children={(field) => {
            const invalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor="mailer-from">Send from</FieldLabel>
                <Input
                  id="mailer-from"
                  type="email"
                  autoComplete="email"
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  required
                  aria-invalid={invalid}
                  aria-describedby={invalid ? "mailer-from-help mailer-from-error" : "mailer-from-help"}
                />
                <FieldDescription id="mailer-from-help">The address your recipients see.</FieldDescription>
                {invalid && <FieldError id="mailer-from-error" errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="provider"
          children={(field) => {
            const invalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor="mailer-provider">Provider</FieldLabel>
                <Select name={field.name} value={field.state.value} onValueChange={(value) => field.handleChange(value)}>
                  <SelectTrigger
                    id="mailer-provider"
                    onBlur={field.handleBlur}
                    aria-required="true"
                    aria-invalid={invalid}
                    aria-describedby={invalid ? "mailer-provider-error" : undefined}
                  >
                    <SelectValue placeholder="Choose a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                    <SelectItem value="postmark">Postmark</SelectItem>
                    <SelectItem value="smtp">Other SMTP server</SelectItem>
                  </SelectContent>
                </Select>
                {invalid && <FieldError id="mailer-provider-error" errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="dailyLimit"
          children={(field) => {
            const invalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor="mailer-limit">Daily limit</FieldLabel>
                <InputNumber
                  id="mailer-limit"
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
                  min={1}
                  required
                  aria-invalid={invalid}
                  aria-describedby={invalid ? "mailer-limit-error" : undefined}
                />
                {invalid && <FieldError id="mailer-limit-error" errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="trackOpens"
          children={(field) => (
            <Field orientation="horizontal">
              <Switch
                id="mailer-track"
                name={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
                aria-describedby="mailer-track-help"
              />
              <FieldContent>
                <FieldLabel htmlFor="mailer-track">Track opens</FieldLabel>
                <FieldDescription id="mailer-track-help">Adds an invisible image to each email.</FieldDescription>
              </FieldContent>
            </Field>
          )}
        />
        <form.Field
          name="terms"
          children={(field) => {
            const invalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field orientation="horizontal" data-invalid={invalid}>
                <Checkbox
                  id="mailer-terms"
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked === true)}
                  aria-required="true"
                  aria-invalid={invalid}
                  aria-describedby={invalid ? "mailer-terms-error" : undefined}
                />
                <FieldContent>
                  <FieldLabel htmlFor="mailer-terms">I accept the sending terms</FieldLabel>
                  {invalid && <FieldError id="mailer-terms-error" errors={field.state.meta.errors} />}
                </FieldContent>
              </Field>
            )
          }}
        />
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <form.Subscribe
          selector={(state) => state.isSubmitting}
          children={(isSubmitting) => (
            <Button type="submit" loading={isSubmitting}>
              Save mailer
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
\`\`\`

Add \`onChange: mailerSchema\` beside \`onSubmit\` to check the fields again as they change. To put a server's message on a field, check on the server in \`validators.onSubmitAsync\` and return \`{ fields: { fromEmail: { message: "This address is not verified for sending." } } }\`: it lands in that field's \`errors\` like any other.`,
        },
        {
          id: "plain-react",
          label: "Plain React",
          markdown: `With no form library, \`useActionState\` keeps the result of the last submit: the errors from your own checks, or the server's answer. The controls are uncontrolled and submit through their \`name\`: \`Select\` and \`Checkbox\` add hidden inputs inside a form, so \`FormData\` has every value. The errors are those of the last submit, and the next submit checks again.

The form calls the action from \`onSubmit\` rather than through \`<form action>\`: React resets a form after its \`action\` finishes, which would empty the fields even when the checks failed.

\`\`\`tsx
import { startTransition, useActionState, useEffect, useRef } from "react"
import { Alert, AlertDescription } from "@booleanpress/ui/alert"
import { Button } from "@booleanpress/ui/button"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

type FieldName = "name" | "fromEmail" | "provider" | "terms"

interface SaveState {
  errors: Partial<Record<FieldName, string>>
  message?: string
  saved?: boolean
}

async function saveMailer(_previous: SaveState, formData: FormData): Promise<SaveState> {
  const errors: SaveState["errors"] = {}
  if (!String(formData.get("name") ?? "").trim()) errors.name = "Enter a name for the mailer."
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(formData.get("fromEmail") ?? ""))) {
    errors.fromEmail = "Enter a full email address, such as hello@example.com."
  }
  if (!formData.get("provider")) errors.provider = "Choose a provider."
  if (formData.get("terms") !== "on") errors.terms = "Accept the terms to save the mailer."
  if (Object.keys(errors).length > 0) return { errors }

  const response = await fetch("/api/mailers", { method: "POST", body: formData })
  if (response.ok) return { errors: {}, saved: true }
  const body: { message?: string; fields?: SaveState["errors"] } = await response.json()
  return { errors: body.fields ?? {}, message: body.message ?? "The mailer could not be saved. Try again." }
}

export function MailerForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, submit, isPending] = useActionState(saveMailer, { errors: {} })

  // After each submit, focus the first field in error (none after a success).
  useEffect(() => {
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
  }, [state])

  const invalid = (name: FieldName) => Boolean(state.errors[name])
  const describedBy = (name: FieldName) => (state.errors[name] ? \`\${name}-error\` : undefined)

  return (
    <form
      ref={formRef}
      noValidate
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        startTransition(() => submit(formData))
      }}
    >
      <FieldGroup>
        <Field data-invalid={invalid("name")}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" name="name" required aria-invalid={invalid("name")} aria-describedby={describedBy("name")} />
          {state.errors.name && <FieldError id="name-error">{state.errors.name}</FieldError>}
        </Field>
        <Field data-invalid={invalid("fromEmail")}>
          <FieldLabel htmlFor="fromEmail">Send from</FieldLabel>
          <Input
            id="fromEmail"
            name="fromEmail"
            type="email"
            autoComplete="email"
            required
            aria-invalid={invalid("fromEmail")}
            aria-describedby={describedBy("fromEmail")}
          />
          {state.errors.fromEmail && <FieldError id="fromEmail-error">{state.errors.fromEmail}</FieldError>}
        </Field>
        <Field data-invalid={invalid("provider")}>
          <FieldLabel htmlFor="provider">Provider</FieldLabel>
          <Select name="provider">
            <SelectTrigger id="provider" aria-required="true" aria-invalid={invalid("provider")} aria-describedby={describedBy("provider")}>
              <SelectValue placeholder="Choose a provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ses">Amazon SES</SelectItem>
              <SelectItem value="postmark">Postmark</SelectItem>
              <SelectItem value="smtp">Other SMTP server</SelectItem>
            </SelectContent>
          </Select>
          {state.errors.provider && <FieldError id="provider-error">{state.errors.provider}</FieldError>}
        </Field>
        <Field orientation="horizontal" data-invalid={invalid("terms")}>
          <Checkbox id="terms" name="terms" aria-required="true" aria-invalid={invalid("terms")} aria-describedby={describedBy("terms")} />
          <FieldContent>
            <FieldLabel htmlFor="terms">I accept the sending terms</FieldLabel>
            {state.errors.terms && <FieldError id="terms-error">{state.errors.terms}</FieldError>}
          </FieldContent>
        </Field>
        {state.message && (
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        {state.saved && (
          <Alert variant="success">
            <AlertDescription>The mailer is saved.</AlertDescription>
          </Alert>
        )}
        <Button type="submit" loading={isPending}>
          Save mailer
        </Button>
      </FieldGroup>
    </form>
  )
}
\`\`\`

In Next.js, \`saveMailer\` can be a Server Action (\`"use server"\` at the top of its file) and the form can call it the same way. If you pass it to \`<form action>\` instead, return the submitted values in the state and give each control its \`defaultValue\`, so the reset after the action puts them back.`,
        },
      ],
    },
    {
      id: "control-values",
      title: "Each control's value",
      markdown: `What each control holds, how to wire it to a form library, and what its \`name\` sends with a plain form submit.

| Control | Value | Wire | Empty | With \`name\`, a form submit sends |
| --- | --- | --- | --- | --- |
| \`Input\`, \`Textarea\` | \`string\` | \`value\` and \`onChange\` (React Hook Form: \`{...field}\`) | \`""\` | the text |
| \`Select\` | an item's \`value\`, a \`string\` | \`value\` and \`onValueChange\` on \`Select\`; the ref and \`onBlur\` on \`SelectTrigger\` | \`""\` (shows the placeholder) | the value, from a hidden native select inside the form |
| \`Checkbox\` | \`true\`, \`false\` or \`"indeterminate"\` | \`checked\`, and \`onCheckedChange={(checked) => onChange(checked === true)}\` for a plain boolean | \`false\` | its \`value\` (\`"on"\`) when checked; nothing when not |
| \`Switch\` | \`boolean\` | \`checked\` and \`onCheckedChange\` | \`false\` | \`"on"\` when on; nothing when off |
| \`Combobox\` | an item's value (a \`string\` or an object); an array with \`multiple\` | \`value\` and \`onValueChange\` on \`Combobox\` | \`null\` (\`[]\` with \`multiple\`) | the value as text; an object through \`itemToStringValue\`, or its \`value\` key |
| \`DatePicker\` | a \`Date\`; a \`Date[]\` with \`mode="multiple"\` | \`value\` and \`onValueChange\`; the ref reaches the text field | \`null\` (\`[]\` with \`multiple\`) | ISO 8601: \`2026-10-14\` for a day, the full instant with \`showTime\`; several dates joined by commas |
| \`InputNumber\` | a \`number\` | \`value\` and \`onValueChange\`; the ref as \`inputRef\` | \`null\` | the number |
| \`FileUpload\` | the files in \`onFilesChange\`, each \`{ id, file, status, progress }\` | \`onFilesChange={(files) => onChange(files.map((entry) => entry.file))}\` | \`[]\` | nothing: append the files to your \`FormData\` yourself, or let \`onUpload\` send them |

In Zod 4 these are: \`z.string().min(1, "…")\` for a required text or \`Select\`; \`z.boolean()\`, with \`.refine((value) => value, "…")\` for a box that must be ticked; \`z.string({ error: "…" })\` for a \`Combobox\` of strings; \`z.date({ error: "…" })\` for a \`DatePicker\`; \`z.number({ error: "…" })\` for an \`InputNumber\`; \`z.array(z.instanceof(File)).min(1, "…")\` for a \`FileUpload\`. The \`error\` message is the one shown for an empty value, as \`null\` is not a string, a date or a number.

A typed date that a \`DatePicker\` cannot read stays in its field, marks the field invalid and empties the value, so a required-date check fails with your message while the text waits to be corrected. An \`InputNumber\` brings a number outside \`min\` and \`max\` back into range when it loses focus.`,
    },
  ],
} satisfies GuideDoc
