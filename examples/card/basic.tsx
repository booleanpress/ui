import { Button } from "@booleanpress/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@booleanpress/ui/card"

export default function CardBasic() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Primary mailer</CardTitle>
        <CardDescription>Amazon SES, eu-west-1</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm">1,840 emails sent in the last 7 days, 12 failed.</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm">
          Send test email
        </Button>
      </CardFooter>
    </Card>
  )
}
