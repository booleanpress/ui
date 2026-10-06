import { Banner, BannerActions, BannerDescription } from "@booleanpress/ui/banner"
import { Button } from "@booleanpress/ui/button"

const ENTRIES = Array.from({ length: 12 }, (_, index) => ({
  id: 4120 - index,
  to: `customer${index + 1}@example.com`,
}))

export default function BannerSticky() {
  return (
    <div className="h-64 w-full overflow-y-auto rounded-md border" role="region" tabIndex={0} aria-label="Email log">
      <Banner tone="destructive" position="sticky">
        <BannerDescription>12 emails bounced in the last hour.</BannerDescription>
        <BannerActions>
          <Button size="sm" variant="outline">
            Review bounces
          </Button>
        </BannerActions>
      </Banner>
      <ul className="divide-y text-sm">
        {ENTRIES.map((entry) => (
          <li key={entry.id} className="flex justify-between px-4 py-2.5">
            <span>{entry.to}</span>
            <span className="text-muted-foreground tabular-nums">#{entry.id}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
