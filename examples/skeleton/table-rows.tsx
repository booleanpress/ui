import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Skeleton } from "@booleanpress/ui/skeleton"

const LOGS = [
  { to: "ada@example.com", subject: "Welcome" },
  { to: "grace@example.com", subject: "Password reset" },
  { to: "linus@example.com", subject: "Invoice 1042" },
]

export default function SkeletonTableRows() {
  const [loading, setLoading] = useState(true)

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div aria-busy={loading} className="flex flex-col gap-3">
        {loading ? (
          <>
            <p role="status" className="sr-only">
              Loading the email log
            </p>
            {LOGS.map((log) => (
              <div key={log.to} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </>
        ) : (
          LOGS.map((log) => (
            <div key={log.to} className="flex items-center justify-between gap-4 text-sm">
              <span>{log.to}</span>
              <span className="text-muted-foreground">{log.subject}</span>
            </div>
          ))
        )}
      </div>
      <Button variant="outline" size="sm" className="self-start" onClick={() => setLoading((value) => !value)}>
        {loading ? "Show the loaded log" : "Show the loading state"}
      </Button>
    </div>
  )
}
