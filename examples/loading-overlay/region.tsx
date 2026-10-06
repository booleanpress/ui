import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@booleanpress/ui/card"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"
import { LoadingOverlay } from "@booleanpress/ui/loading-overlay"

export default function LoadingOverlayRegion() {
  const [saving, setSaving] = useState(false)

  // Stands in for the request that saves the mailer.
  const save = () => {
    setSaving(true)
    setTimeout(() => setSaving(false), 2000)
  }

  return (
    <LoadingOverlay loading={saving} className="w-full max-w-sm rounded-xl">
      <Card>
        <CardHeader>
          <CardTitle>Primary SMTP</CardTitle>
          <CardDescription>The sender address of every email.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Label htmlFor="overlay-from">From address</Label>
          <Input id="overlay-from" defaultValue="hello@example.com" />
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={save}>Save</Button>
        </CardFooter>
      </Card>
    </LoadingOverlay>
  )
}
