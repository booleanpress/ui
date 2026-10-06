"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { cn } from "@/lib/utils"

import { useUiConfig } from "@booleanpress/ui/provider"

// boolean-ui patch: the status toasts take their colours from the status tokens, as Alert's variants do (stock leaves
// rich colours to sonner's own palette). The BooleanPress look: the subtle status fill, the status edge, and the title
// and icon in the strong status colour. Sonner declares `--success-border`, `--info-border` and `--warning-border` on
// the toaster itself, the same names as the theme's tokens, so those three are set to `inherit`: the toaster takes
// the theme's value from its parent instead of Sonner's.
const STATUS_COLORS = Object.fromEntries(
  (
    [
      ["success", "success", "inherit"],
      ["info", "info", "inherit"],
      ["warning", "warning", "inherit"],
      ["error", "destructive", "var(--destructive-border)"],
    ] as const
  ).flatMap(([type, token, border]) => [
    [`--${type}-bg`, `var(--${token}-subtle)`],
    [`--${type}-border`, border],
    [`--${type}-text`, `var(--${token}-strong)`],
  ])
)

/** @since 0.1.1 */
const Toaster = ({
  theme = "system",
  className,
  style,
  toastOptions,
  ...props
}: ToasterProps) => {
  const { strings, dir } = useUiConfig()
  const rtl = dir === "rtl"

  return (
    <Sonner
      // boolean-ui patch: the app passes its theme (stock reads next-themes), and the direction comes from the provider.
      theme={theme}
      dir={dir}
      // boolean-ui patch: the app's className joins the toaster's own classes (stock: it replaces them).
      className={cn("toaster group", className)}
      // boolean-ui patch: coloured status toasts with a close button, 4 seconds, at most three at once (stock: sonner's
      // defaults), and the region's name from the provider.
      richColors
      closeButton
      duration={4000}
      visibleToasts={3}
      containerAriaLabel={strings.notifications}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          // boolean-ui patch: the BooleanPress look — a 6 px radius (the theme's medium radius), 18.75rem wide or the
          // phone's width, and the close button inside the top corner at the inline end (stock: var(--radius),
          // sonner's width, and the close button astride the corner at the inline start).
          "--border-radius": "calc(var(--radius) - 2px)",
          "--width": "min(18.75rem, calc(100vw - 2rem))",
          "--gap": "0.75rem",
          // `auto`, not `unset`: on a custom property `unset` inherits Sonner's own value from <html>.
          "--toast-close-button-start": rtl ? "0.25rem" : "auto",
          "--toast-close-button-end": rtl ? "auto" : "0.25rem",
          "--toast-close-button-transform": "none",
          ...STATUS_COLORS,
          ...style,
        } as React.CSSProperties
      }
      toastOptions={{
        closeButtonAriaLabel: strings.closeNotification,
        ...toastOptions,
        // boolean-ui patch: the BooleanPress look. Sonner's own stylesheet is unlayered, so the classes that replace
        // its values are `!important`. The card: 0.625rem padding, 0.5rem from icon to text, top-aligned, a blurred
        // backdrop, the overlay shadow (a faint status-tinted one on status toasts), and the system's focus outline in
        // place of Sonner's focus shadow. The title is 14 px medium; the
        // detail 12 px medium, muted on a plain toast and in the text colour on a status toast. The close button is a
        // 24 px round button in the toast's colour, with a status-tinted fill on hover. Actions are small buttons; the
        // last one keeps clear of the close button. The card, title and content rules hold for Sonner's own toasts
        // only (`data-styled`): a `toast.custom()` or `unstyled` toast is left as its author draws it.
        classNames: {
          toast:
            "group toast focus-visible:outline-solid! focus-visible:outline-1! focus-visible:outline-offset-2! focus-visible:outline-ring! data-[styled=true]:items-start! data-[styled=true]:gap-2! data-[styled=true]:p-2.5! data-[styled=true]:text-sm/normal! data-[styled=true]:shadow-md! data-[styled=true]:backdrop-blur-[10px] data-[styled=true]:data-[type=success]:shadow-[0_4px_8px_0_color-mix(in_srgb,var(--success)_4%,transparent)]! data-[styled=true]:data-[type=info]:shadow-[0_4px_8px_0_color-mix(in_srgb,var(--info)_4%,transparent)]! data-[styled=true]:data-[type=warning]:shadow-[0_4px_8px_0_color-mix(in_srgb,var(--warning)_4%,transparent)]! data-[styled=true]:data-[type=error]:shadow-[0_4px_8px_0_color-mix(in_srgb,var(--destructive)_4%,transparent)]!",
          title: "group-data-[styled=true]:text-sm/normal! group-data-[styled=true]:font-medium!",
          description:
            "text-xs/normal! font-medium! text-muted-foreground! group-data-[type=success]:text-foreground! group-data-[type=info]:text-foreground! group-data-[type=warning]:text-foreground! group-data-[type=error]:text-foreground!",
          content: "min-w-0 group-data-[styled=true]:gap-1! group-data-[styled=true]:pe-4.5",
          icon: "mt-px ms-0! me-0! [&_svg]:mx-0! group-data-[type=success]:text-success-strong group-data-[type=info]:text-info-strong group-data-[type=warning]:text-warning-strong group-data-[type=error]:text-destructive-strong",
          closeButton:
            "top-1! size-6! border-0! bg-transparent! text-current! transition-colors hover:bg-accent! focus-visible:shadow-none! focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current group-data-[type=success]:hover:bg-success-tag! group-data-[type=info]:hover:bg-info-tag! group-data-[type=warning]:hover:bg-warning-tag! group-data-[type=error]:hover:bg-destructive-tag! [&_svg]:size-3.5!",
          actionButton: "me-6! h-7! rounded-md! px-2! bg-primary! text-primary-foreground!",
          cancelButton: "h-7! rounded-md! px-2! bg-secondary! text-secondary-foreground!",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
