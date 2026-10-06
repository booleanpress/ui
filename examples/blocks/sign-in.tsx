import * as React from "react"
import { CircleCheckIcon, KeyRoundIcon, LifeBuoyIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@booleanpress/ui/alert"
import { Button } from "@booleanpress/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@booleanpress/ui/card"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from "@booleanpress/ui/field"
import { Input } from "@booleanpress/ui/input"
import { Link } from "@booleanpress/ui/link"
import { PasswordInput } from "@booleanpress/ui/password-input"

type Errors = { email?: string; password?: string }

export default function SignInBlock() {
  const [errors, setErrors] = React.useState<Errors>({})
  const [pending, setPending] = React.useState(false)
  const [signedIn, setSignedIn] = React.useState(false)

  function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const found: Errors = {}
    if (!String(data.get("email") ?? "").trim()) found.email = "Enter the email address you signed up with."
    if (!String(data.get("password") ?? "")) found.password = "Enter your password."
    setErrors(found)
    const first = found.email ? "email" : found.password ? "password" : null
    if (first) {
      form.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus()
      return
    }
    setPending(true)
    // Your sign-in request goes here; a fixed delay stands in for it.
    window.setTimeout(() => {
      setPending(false)
      setSignedIn(true)
    }, 800)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-subtle px-4 py-10">
      <p className="flex items-center gap-2 text-base font-semibold text-foreground">
        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <LifeBuoyIcon className="size-4" aria-hidden="true" />
        </span>
        Acme
      </p>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1>Sign in to your help desk</h1>
          </CardTitle>
          <CardDescription>Use the email address and password of your Acme account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {signedIn ? (
            <Alert variant="success" role="status">
              <CircleCheckIcon />
              <AlertTitle>Signed in</AlertTitle>
              <AlertDescription>Opening your inbox: 14 open tickets.</AlertDescription>
            </Alert>
          ) : null}
          <form noValidate onSubmit={signIn}>
            <FieldGroup>
              <Field data-invalid={errors.email ? "true" : undefined}>
                <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
                <Input
                  id="sign-in-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "sign-in-email-error" : undefined}
                />
                {errors.email ? <FieldError id="sign-in-email-error">{errors.email}</FieldError> : null}
              </Field>
              <Field data-invalid={errors.password ? "true" : undefined}>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
                  <Link href="#reset-password" size="sm" underline="hover">
                    Forgot your password?
                  </Link>
                </div>
                <PasswordInput
                  id="sign-in-password"
                  name="password"
                  autoComplete="current-password"
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={errors.password ? "sign-in-password-error" : undefined}
                />
                {errors.password ? <FieldError id="sign-in-password-error">{errors.password}</FieldError> : null}
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="sign-in-remember" name="remember" defaultChecked />
                <FieldLabel htmlFor="sign-in-remember" className="font-normal">
                  Keep me signed in for 30 days
                </FieldLabel>
              </Field>
              <Button type="submit" loading={pending} className="w-full">
                Sign in
              </Button>
            </FieldGroup>
          </form>
          <FieldSeparator>or</FieldSeparator>
          <Button variant="outline" className="w-full">
            <KeyRoundIcon aria-hidden="true" />
            Sign in with single sign-on
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link href="#request-access" underline="hover">
              Ask your administrator for an invitation
            </Link>
          </p>
        </CardFooter>
      </Card>
      <nav aria-label="Legal" className="flex gap-4">
        <Link href="#privacy" variant="muted" size="sm" underline="hover">
          Privacy
        </Link>
        <Link href="#terms" variant="muted" size="sm" underline="hover">
          Terms
        </Link>
        <Link href="#status" variant="muted" size="sm" underline="hover">
          System status
        </Link>
      </nav>
    </main>
  )
}
