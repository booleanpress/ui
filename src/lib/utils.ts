import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Joins class names and resolves Tailwind conflicts, so a consumer's `className` overrides a component's default.
 *
 * @since 0.1.0
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Fills the `{name}` placeholders of a built-in string with their values: `fillString("Remove {label}", { label: "VIP" })`
 * returns "Remove VIP". A placeholder with no value is left as written, so a translation that drops one still reads.
 *
 * @since 0.1.0
 */
export function fillString(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in values ? String(values[name]) : match))
}
