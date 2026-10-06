import { Skeleton } from "@booleanpress/ui/skeleton"

export default function SkeletonLines() {
  return (
    <div aria-busy="true" className="flex w-full max-w-sm flex-col gap-2">
      <p role="status" className="sr-only">
        Loading the message
      </p>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
