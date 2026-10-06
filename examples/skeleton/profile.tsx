import { Skeleton } from "@booleanpress/ui/skeleton"

export default function SkeletonProfile() {
  return (
    <div aria-busy="true" className="flex w-full max-w-sm items-center gap-4">
      <p role="status" className="sr-only">
        Loading the person
      </p>
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  )
}
