"use client"

import * as React from "react"
import { CheckCircleIcon, CheckIcon, EyeIcon, EyeOffIcon, ShieldIcon, XIcon } from "lucide-react"

import { Popover as PopoverPrimitive } from "radix-ui"

import { Progress } from "@/components/progress"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/input-group"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/popover"
import { useFormReset } from "@/lib/form-reset"
import { cn, fillString } from "@/lib/utils"
import { useControlSize, useUiStrings, type ControlSize, type FieldVariant } from "@booleanpress/ui/provider"

// The eye scales with the field: a 20, 24 or 28px button round a 12, 14 or 16px icon, the icon 8, 10 or 12px from the edge.
const toggleSizes: Record<ControlSize, string> = { sm: "size-5", default: "size-6", lg: "size-7" }
const eyeSizes: Record<ControlSize, string> = { sm: "size-3", default: "size-3.5", lg: "size-4" }

/**
 * A requirement the value is checked against, shown as a line of the checklist under the field.
 *
 * @since 0.1.0
 */
type PasswordRule = {
  /** What the rule asks for, as the checklist shows it: "At least 12 characters". */
  label: string
  /** Whether the value meets it. */
  test: (value: string) => boolean
  /** Relative contribution to the rules-based meter; defaults to 1. */
  weight?: number
}

/**
 * How strong a value is, as the meter shows it.
 *
 * @since 0.1.0
 */
type PasswordStrength = "too-weak" | "weak" | "medium" | "fair" | "strong" | "very-strong"

/** A strength label and an explicit percentage for a custom scoring policy. @since 0.1.0 */
type PasswordStrengthScore = { level: PasswordStrength; percent: number }

/** Scores five length/character checks into four strength levels. @since 0.1.0 */
function scorePasswordStrength(value: string): PasswordStrength | null {
  if (!value) return null
  const score = [
    Array.from(value).length >= 8,
    Array.from(value).length >= 12,
    /[a-z]/.test(value) && /[A-Z]/.test(value),
    /[0-9]/.test(value),
    /[^a-zA-Z0-9]/.test(value),
  ].filter(Boolean).length
  return score <= 1 ? "weak" : score === 2 ? "medium" : score === 3 ? "strong" : "very-strong"
}

/** Scores the supplied requirements by their relative weights. @since 0.1.0 */
function scorePasswordRules(value: string, rules: PasswordRule[]): PasswordStrengthScore | null {
  if (!value) return null
  const weights = rules.map((rule) => Number.isFinite(rule.weight ?? 1) ? Math.max(0, rule.weight ?? 1) : 0)
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  const percent = total ? rules.reduce((sum, rule, index) => sum + (rule.test(value) ? weights[index] : 0), 0) / total * 100 : 0
  if (!percent) return null
  const level = percent <= 20 ? "too-weak" : percent <= 40 ? "weak" : percent <= 60 ? "fair" : percent <= 80 ? "strong" : "very-strong"
  return { level, percent }
}

// boolean-ui patch: four-level feedback and weighted requirements share one accessible progress meter.
const strengthLooks: Record<PasswordStrength, { percent: number; tag: "destructive" | "warning" | "info" | "success" }> = {
  "too-weak": { percent: 20, tag: "destructive" },
  weak: { percent: 25, tag: "destructive" },
  medium: { percent: 50, tag: "warning" },
  fair: { percent: 60, tag: "info" },
  strong: { percent: 75, tag: "info" },
  "very-strong": { percent: 100, tag: "success" },
}

/** One line per change since the last announcement: a rule met or lost, the strength's new level. */
function describeChanges(
  previous: { met: boolean[]; level: PasswordStrength | null },
  current: { met: boolean[]; level: PasswordStrength | null },
  rules: PasswordRule[],
  strings: ReturnType<typeof useUiStrings>
) {
  const lines: string[] = []
  current.met.forEach((met, index) => {
    if (previous.met[index] !== undefined && previous.met[index] !== met) {
      lines.push(fillString(met ? strings.ruleMet : strings.ruleNotMet, { label: rules[index].label }))
    }
  })
  if (current.level && current.level !== previous.level) {
    lines.push(fillString(strings.passwordStrength, { level: strengthText(current.level, strings) }))
  }
  return lines
}

function strengthText(level: PasswordStrength, strings: ReturnType<typeof useUiStrings>) {
  const labels = {
    "too-weak": strings.strengthTooWeak,
    weak: strings.strengthWeak,
    medium: strings.strengthMedium,
    fair: strings.strengthFair,
    strong: strings.strengthStrong,
    "very-strong": strings.strengthVeryStrong,
  }
  return labels[level]
}

/**
 * A secret field with an optional button that shows or hides the value. For an API key or an SMTP password, not a sign-in
 * password: it opts out of password-manager autofill, which would otherwise put the site's saved login here.
 *
 * @since 0.1.0
 */
function PasswordInput({
  className,
  disabled,
  size,
  variant,
  rules,
  strength = false,
  mask,
  defaultMask = true,
  onMaskChange,
  showToggle = false,
  scoreStrength = scorePasswordStrength,
  feedback = "inline",
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  "aria-describedby": ariaDescribedBy,
  ...props
}: Omit<React.ComponentProps<typeof InputGroupInput>, "type"> & {
  /** The field's size: 26, 34 or 42 px tall. Defaults to the provider's `controlSize`. @since 0.1.0 */
  size?: ControlSize
  /** `filled` draws the grey `--field-filled` fill. Defaults to the provider's `fieldVariant`. @since 0.1.0 */
  variant?: FieldVariant
  /** Requirements shown as a checklist, each ticked once the value meets it. @since 0.1.0 */
  rules?: PasswordRule[]
  /** Shows four strength levels, or weighted requirements with `rules`. @since 0.1.0 */
  strength?: boolean | "rules"
  /** Replaces the built-in strength score (`scorePasswordStrength`). @since 0.1.0 */
  scoreStrength?: (value: string) => PasswordStrength | PasswordStrengthScore | null
  /** Where the meter and the checklist go: `inline` under the field, or `popover`, a panel below it while it has focus. @since 0.1.0 */
  feedback?: "inline" | "popover"
  /** Controls whether the value is masked. Pair with onMaskChange. */
  mask?: boolean
  /** Whether an uncontrolled field starts masked. Defaults to true. */
  defaultMask?: boolean
  /** Requests a new mask state; a controlled parent may accept or reject it. */
  onMaskChange?: (masked: boolean) => void
  /** Adds a keyboard-accessible visibility button. Defaults to false. */
  showToggle?: boolean
}) {
  const strings = useUiStrings()
  const resolvedSize = useControlSize(size)
  const [uncontrolledMask, setUncontrolledMask] = React.useState(defaultMask)
  const masked = mask ?? uncontrolledMask
  const [uncontrolledValue, setUncontrolledValue] = React.useState(() => String(defaultValue ?? ""))
  const [focused, setFocused] = React.useState(false)
  const [dismissed, setDismissed] = React.useState(false)
  const feedbackId = React.useId()
  const anchorRef = React.useRef<HTMLDivElement | null>(null)

  // A form reset puts the input back to its default value without an input event: read it again, so the checklist and
  // the meter follow.
  useFormReset(
    anchorRef,
    () => setUncontrolledValue(anchorRef.current?.querySelector("input")?.value ?? ""),
    { enabled: value === undefined, form: props.form }
  )

  const hasFeedback = (rules?.length ?? 0) > 0 || strength
  const current = value !== undefined ? String(value) : uncontrolledValue
  const met = (rules ?? []).map((rule) => rule.test(current))
  const score = strength === "rules" ? scorePasswordRules(current, rules ?? []) : strength ? scoreStrength(current) : null
  const level = typeof score === "string" ? score : score?.level ?? null
  const percentage = typeof score === "object" && score ? score.percent : level ? strengthLooks[level].percent : 0
  const percent = Number.isFinite(percentage) ? Math.min(100, Math.max(0, percentage)) : 0

  // Each change of a rule or of the level is announced once, politely, while typing goes on.
  const snapshot = `${level ?? ""}|${met.map(Number).join("")}`
  const [previous, setPrevious] = React.useState({ snapshot, met, level })
  const [announcement, setAnnouncement] = React.useState<string[]>([])
  if (snapshot !== previous.snapshot) {
    setPrevious({ snapshot, met, level })
    setAnnouncement(describeChanges(previous, { met, level }, rules ?? [], strings))
  }

  const popover = hasFeedback && feedback === "popover"
  const open = popover && focused && !dismissed && !disabled
  const showFeedback = hasFeedback && (!popover || open)

  const group = (
    <InputGroup ref={anchorRef} className={className} size={resolvedSize} variant={variant}>
      <InputGroupInput
        type={masked ? "password" : "text"}
        autoComplete="new-password"
        data-1p-ignore=""
        data-lpignore="true"
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        aria-describedby={[ariaDescribedBy, showFeedback ? feedbackId : null].filter(Boolean).join(" ") || undefined}
        onChange={(event) => {
          if (value === undefined) setUncontrolledValue(event.target.value)
          setDismissed(false)
          onChange?.(event)
        }}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          setDismissed(false)
          onBlur?.(event)
        }}
        {...props}
      />
      {showToggle ? <InputGroupAddon align="inline-end">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={disabled}
          // boolean-ui patch: the toggle draws as a bare 14px eye in the field-icon colour, 10px from the edge, a step darker
          // on hover, with no fill (the products' copy: a ghost button with a hover fill and a 12px icon).
          className={cn(
            "text-field-icon hover:bg-transparent hover:text-muted-foreground active:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent",
            toggleSizes[resolvedSize]
          )}
          onClick={() => {
            if (mask === undefined) setUncontrolledMask(!masked)
            onMaskChange?.(!masked)
          }}
          // A toggle button keeps one name and reports its state with aria-pressed, so the state is read once.
          aria-label={strings.showPassword}
          aria-pressed={!masked}
        >
          {!masked ? <EyeOffIcon className={eyeSizes[resolvedSize]} /> : <EyeIcon className={eyeSizes[resolvedSize]} />}
        </Button>
      </InputGroupAddon> : null}
    </InputGroup>
  )

  if (!hasFeedback) return group

  const badge = level ? (
    <Badge variant={strength === "rules" && level === "weak" ? "warning" : strength === "rules" && level === "strong" ? "success" : strengthLooks[level].tag}>
      <span className="sr-only">{fillString(strings.passwordStrength, { level: strengthText(level, strings) })}</span>
      <span aria-hidden="true">{strengthText(level, strings)}</span>
    </Badge>
  ) : null
  const meterAndRules = (
    <div id={feedbackId} data-slot="password-input-feedback" className={cn("flex flex-col", popover ? "gap-3" : "gap-2")}>
      {popover ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldIcon aria-hidden="true" className="size-5" />
            <span className="text-sm font-semibold">{strings.passwordStrengthTitle}</span>
          </div>
          {badge}
        </div>
      ) : null}
      {strength && (level || popover) ? (
        <div data-slot="password-input-strength" data-level={level ?? undefined} className="flex flex-col gap-2">
          <Progress
            data-slot="password-input-meter"
            value={percent}
            aria-label={strings.passwordStrengthTitle}
            getValueLabel={() => level ? strengthText(level, strings) : ""}
          />
          {!popover ? <div className="flex justify-end">{badge}</div> : null}
        </div>
      ) : null}
      {rules && rules.length > 0 ? (
        <ul data-slot="password-input-rules" className={cn("flex list-none flex-col gap-2", popover ? "m-0 p-0 text-xs" : "ms-1 my-1 text-sm")}>
          {rules.map((rule, index) => (
            <li key={rule.label} data-slot="password-input-rule" data-met={met[index] || undefined} className="flex items-center gap-2">
              {popover ? (
                met[index] ? <CheckIcon aria-hidden="true" className="size-3.5 shrink-0 text-success" /> : <XIcon aria-hidden="true" className="size-3.5 shrink-0 text-destructive" />
              ) : (
                <CheckCircleIcon aria-hidden="true" className={cn(
                  "size-4 shrink-0 transition-[color,opacity,transform] duration-(--bui-duration-feedback) ease-out motion-reduce:transform-none",
                  met[index] ? "scale-110 text-success opacity-100" : "scale-90 text-control opacity-70"
                )} />
              )}
              <span className="sr-only">{fillString(met[index] ? strings.ruleMet : strings.ruleNotMet, { label: rule.label })}</span>
              <span aria-hidden="true" className={cn(
                "transition-[color,opacity] duration-(--bui-duration-feedback) ease-out",
                popover ? (met[index] ? "text-muted-foreground" : "text-foreground") : met[index] ? "text-success-tag-foreground line-through decoration-success/70 decoration-2" : "text-foreground dark:text-secondary-foreground opacity-70"
              )}>{rule.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )

  const liveRegion = (
    <div role="status" aria-live="polite" data-slot="password-input-status" className="sr-only">
      {announcement.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  )

  if (popover) {
    return (
      <div data-slot="password-input" className="flex w-full flex-col">
        <Popover open={open}>
          <PopoverAnchor asChild>{group}</PopoverAnchor>
          <PopoverContent
            align="start"
            sideOffset={12}
            // The panel only shows the checklist: the focus stays in the field, and a press on the panel keeps it there.
            role="group"
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
            onMouseDown={(event) => event.preventDefault()}
            onEscapeKeyDown={() => setDismissed(true)}
            onInteractOutside={(event) => {
              if (anchorRef.current?.contains(event.target as Node)) event.preventDefault()
            }}
            data-slot="password-input-popover"
            className="w-72 max-w-[calc(100vw-2rem)] p-4"
          >
            <PopoverPrimitive.Arrow className="fill-popover" />
            {meterAndRules}
          </PopoverContent>
        </Popover>
        {liveRegion}
      </div>
    )
  }

  return (
    <div data-slot="password-input" className="flex w-full flex-col gap-2">
      {group}
      {meterAndRules}
      {liveRegion}
    </div>
  )
}

export { PasswordInput, scorePasswordStrength, scorePasswordRules }
export type { PasswordRule, PasswordStrength, PasswordStrengthScore }
