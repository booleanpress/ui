import { useEffect, useRef, useState } from "react"
import { Banner, BannerDescription } from "@booleanpress/ui/banner"
import { Button } from "@booleanpress/ui/button"

export default function BannerDismissible() {
  const [key, setKey] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const showAgain = useRef<HTMLButtonElement>(null)
  const wrapper = useRef<HTMLDivElement>(null)

  // The banner came back from "Show the banner again", which is gone: focus its ×.
  useEffect(() => {
    if (key > 0) wrapper.current?.querySelector<HTMLElement>("[data-slot=banner-dismiss]")?.focus()
  }, [key])

  return (
    <div ref={wrapper} className="flex w-full flex-col items-start gap-3">
      <Banner key={key} tone="info" dismissible onDismiss={() => setDismissed(true)} returnFocusTo={showAgain}>
        <BannerDescription>Version 2.4 adds per-site sending limits. Read what changed in the release notes.</BannerDescription>
      </Banner>
      {dismissed && (
        <Button
          ref={showAgain}
          variant="outline"
          size="sm"
          onClick={() => {
            setDismissed(false)
            setKey((value) => value + 1)
          }}
        >
          Show the banner again
        </Button>
      )}
    </div>
  )
}
