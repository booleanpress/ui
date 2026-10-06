import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@booleanpress/ui/card"

export default function CardSimple() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardDescription>Delivered today</CardDescription>
        <CardTitle className="text-3xl tabular-nums">1,284</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">98.7% of emails sent.</CardContent>
    </Card>
  )
}
