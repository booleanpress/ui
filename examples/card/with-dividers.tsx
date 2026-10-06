import { Button } from "@booleanpress/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@booleanpress/ui/card"

export default function CardWithDividers() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>Delete API key</CardTitle>
        <CardDescription>Requests that use this key stop working at once.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        The key <code className="font-mono">smtp-prod-2</code> was last used 3 minutes ago.
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Delete key</Button>
      </CardFooter>
    </Card>
  )
}
