"use client"

import { AspectRatio as AspectRatioPrimitive } from "radix-ui"

/** @since 0.1.1 */
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
