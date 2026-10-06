# Dialog family (Dialog, AlertDialog, Sheet) — Boolean UI spec

| | |
| --- | --- |
| **Status** | built (0.1.1) — the first component specified in full |
| **Consumers** (2026-10-02) | App A and its add-on, and App B: Dialog, AlertDialog, CommandDialog, and Sheet inside the mobile sidebar; the maintainers keep the call sites |
| **Base** | shadcn `new-york` `dialog`, `alert-dialog`, `sheet` · Radix `Dialog` / `AlertDialog` (radix-ui 1.6.7) |
| **Pattern** | APG Dialog (Modal) <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/> · APG Alert and Message Dialogs <https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/> |
| **Completeness references** | Base UI Dialog <https://base-ui.com/react/components/dialog> · React Aria Modal <https://react-aria.adobe.com/Modal> |

## Purpose and non-goals

A modal surface for a focused task (Dialog), a confirmation of a consequential action (AlertDialog), or a side panel (Sheet). All three share one overlay contract: portal, backdrop, focus trap, Escape, focus return, scroll lock and motion.

Not in scope: non-modal floating panels (use Popover); draggable, resizable or maximisable windows (no Boolean screen needs them); stacking more than one dialog on top of another (a dialog may open a popover or select, never a second dialog).

## Anatomy

| Part | `data-slot` | Required |
| --- | --- | --- |
| Root | — | yes |
| Trigger | `dialog-trigger` | no (controlled dialogs open from code) |
| Overlay (backdrop) | `dialog-overlay` | yes, rendered by Content |
| Content | `dialog-content` | yes |
| Header → Title, Description | `dialog-header`, `dialog-title`, `dialog-description` | Title required (may be visually hidden); Description optional |
| Body (scroll area) | `dialog-body` | **new** — the part that scrolls when content is taller than the viewport |
| Footer | `dialog-footer` | no |
| Close (×) — the system icon button `Button variant="ghost" size="icon"`, round | `dialog-close` | Dialog and Sheet: on by default; AlertDialog: never |

AlertDialog uses the `alert-dialog-*` slots with Action and Cancel in place of Close. Sheet uses the `sheet-*` slots and a `side` (top, right, bottom, left).

## API

| Prop | On | Type | Default | Notes |
| --- | --- | --- | --- | --- |
| `open`, `defaultOpen`, `onOpenChange` | Root | Radix | — | controlled and uncontrolled, as Radix |
| `showCloseButton` | Content | `boolean` | `true` | stock shadcn prop, kept |
| `size` | Content | `"sm" \| "md" \| "lg"` | `"md"` | **new**: 384 / 512 / 672 px max width. `md` equals stock's `sm:max-w-lg`. Replaces ad-hoc `className="sm:max-w-…"`; still overridable by `className` |
| `returnFocusTo` | Content | `RefObject \| () => HTMLElement \| null` | — | **new**: where focus goes on close when neither the trigger nor the element that opened the dialog still exists (see *Focus*) |
| `side` | Sheet Content | `"top" \| "right" \| "bottom" \| "left"` | `"right"` | stock |
| `variant` | AlertDialogAction | Button variants | `"default"` | `"destructive"` for deletions, as conventions §3 already require |

## States matrix

| State | Visual | Attributes / ARIA | Gallery story |
| --- | --- | --- | --- |
| closed | nothing rendered | — | — |
| opening | backdrop fades in, content fades and zooms 95 → 100 % (`--bui-duration-slow`, `--bui-ease-enter`); Sheet slides from its side | `data-state="open"` | Basic, Sheet Sides |
| open | centred content, backdrop `bg-mask` | `role="dialog"` (`alertdialog`), `aria-modal="true"`, `aria-labelledby` → Title, `aria-describedby` → Description or `undefined` | Basic, Alert, Sheet ×4 sides |
| open, content taller than the viewport | header and footer stay visible; the body scrolls; the content never extends under the WordPress admin bar | `max-height: calc(100dvh - var(--wp-admin--admin-bar--height, 0px) - 2rem)` | Long content |
| open, nested popover or select | the popover sits above the dialog; Escape closes the popover first, then the dialog | — | Nested select |
| submitting | the primary action shows `<Spinner/>` and keeps its width; the close controls stay enabled; the product decides what closing mid-request means | `aria-busy="true"` on the form | Submitting |
| invalid form inside | field errors inline (Field), the first invalid field receives focus | `aria-invalid`, `aria-describedby` → error | Validation |
| closing | content and backdrop fade out over 100 ms, opacity only, holding the last keyframe until removed (standard §6.3 rule 5); never painted again after fading | `data-state="closed"` | Basic (⚙ → **Motion** → **Exits fade** or **Exits instant**) |

## Keyboard

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab / Shift+Tab | moves focus through the dialog's focusable elements and wraps; never leaves the dialog | APG Dialog (Modal) |
| Escape | closes Dialog and Sheet; on AlertDialog it equals **Cancel**; with a nested popover open, it closes the popover first | APG |
| Enter / Space on Close, Action or Cancel | activates it | native button |
| Enter inside a form field | submits the form when the dialog contains a `<form>` with a submit button | native form |

## Focus

- **On open:** the first focusable element in the body; or the element named by Radix `onOpenAutoFocus`. For AlertDialog, focus goes to **Cancel**, the least destructive action (APG).
- **Trap:** yes, while open.
- **On close:** back to the trigger. When there is no trigger — most product dialogs are opened from code, through `open` state — focus goes back to the element that had focus when the dialog opened (the APG's "element that invoked the dialog"; Radix alone would drop it on `<body>`). When that element is gone too, because the dialog deleted the row it sat in, focus goes to `returnFocusTo`: the product passes the list heading or the next row. Focus never falls to `<body>`.
- **Visible focus:** the shared 1 px `--ring` outline, 2 px off; the × button and the footer's buttons show it.

## Accessibility

- The Title is always present; when the design has no visible title, it is rendered `sr-only`.
- When there is no Description, set `aria-describedby={undefined}` so Radix does not warn and screen readers do not read stray text.
- **× close button:** the system's ghost icon button, 36 × 36 px and round, above WCAG 2.5.8's 24 px minimum, with its accessible name from `strings.close`. It replaces App A's 16 px stock icon and App B's hand-sized 24 px box. It is recorded in `PATCHES.md` §1 (rows 1–2) and follows shadcn's newer bases and GitHub Primer, which both use a standard icon button for it.
- Background content is hidden from assistive technology while open (Radix). Page scroll is locked. Both pilot apps scroll inside their own app root, not the WordPress page, so locking the page moves nothing sideways; no `scrollbar-gutter` rule is needed.
- Contrast: Title and Description against `--popover`/`--background` at least 4.5:1 in both themes and both brand palettes.

## Content, i18n and RTL

| Built-in string | Provider key | English default |
| --- | --- | --- |
| Close button name (Dialog, Sheet) | `close` | Close |
| Command dialog title (sr-only) | `commandTitle` | Command Palette |
| Command dialog description (sr-only) | `commandDescription` | Search for a command to run... |
| Mobile sidebar sheet title / description (sr-only) | `sidebarTitle` / `sidebarDescription` | Sidebar / Displays the mobile sidebar. |

- Titles wrap; they never truncate.
- The footer puts the primary action at the inline end; below 640 px buttons stack with the primary on top (stock `flex-col-reverse sm:flex-row sm:justify-end`).
- RTL: the × sits at the inline end (`end-4.5`, not `right-4.5`). The Sheet's `side="right"` stays physical (it is a screen edge).

## Motion

- **Enter:** backdrop opacity, `--bui-duration-slow` (200 ms); content opacity + zoom 95 % → 100 %, `--bui-duration-slow`, `--bui-ease-enter`; Sheet slides fully in from its side, `--bui-duration-slow`.
- **Exit:** per standard §6.3 rule 5: content and backdrop fade out over 100 ms (`--bui-duration-exit`, `--bui-ease-exit`), opacity only, and hold their last keyframe until removed.
- **Reduced motion:** no zoom or slide; opacity only, at most 100 ms.

## Responsive and density

- Below 640 px: width `calc(100% - 2rem)`, footer stacked.
- At WordPress's 782 px breakpoint, the admin bar is 46 px: the max-height uses the core variable `--wp-admin--admin-bar--height`, never a literal.
- Dialog and AlertDialog: 1.125 rem padding and gap (`p-4.5`, `gap-4.5`), a 12 px radius and the modal shadow (`shadow-xl`); the title is 18 px semibold on a 27 px line. Sheet: no gap between its parts; the header and footer carry 1.125 rem padding; side sheets are at most 20 rem wide. The 36 px close button sits at the top inline-end corner, 1.125 rem in (`top-4.5 end-4.5`); beside it the title's first line is padded to 36 px, so the two share a centre line. The header keeps room for it (`pe-11` in Dialog, `pe-15.5` in Sheet), so a long title wraps before the button.

## Theming

Uses `--popover`, `--popover-foreground`, `--border`, `--ring`, `--muted-foreground`, `--subtle` and `--accent` (the ×'s hover and press), plus the overlay colour `--mask` (40 % black in light, 60 % in dark). Brand colour appears only through the Action button.

## Host (WordPress admin)

- Portalled to `document.body`, so it sits outside the app root. The product's host CSS lowers WordPress chrome below `z-50` on its screen; the package's `theme.css` resets WordPress's element styles inside every portalled overlay (`body.wp-admin [data-slot="dialog-content"] …`), and the panel carries its own text colour (`text-popover-foreground`), so it is readable in the dark theme outside the app root.
- WordPress `.wrap` and `#wpbody-content` styles must not reach the content. The documentation's WordPress admin frame proves this.

## Edge cases

1. Content taller than the viewport at 1280 × 720 with the admin bar: the body scrolls; header and footer stay visible.
2. The trigger row is deleted by the dialog's action: focus goes to `returnFocusTo`, never to `<body>`.
3. A Select opened inside a dialog: the list renders above the dialog and is not clipped; Escape closes the list only.
4. Double-clicking the primary action: the product disables it while its request runs; the dialog does not close twice.
5. Rapidly opening and closing (pressing Escape during the enter animation): no flash, and no dialog left mounted.
6. The route changes while a dialog is open (hash navigation): the dialog closes and the scroll lock is released.
7. A 200 % zoom and a long translated title: the title wraps and the × does not overlap it.
8. Dark mode with a green brand palette and a violet one: same contrast.

## Tests

- **Behaviour (Vitest + Testing Library):** focus moves into the dialog; Tab wraps at both ends; Escape closes and returns focus; a dialog opened from code returns focus to the button that opened it; Escape with a nested open select closes only the select; AlertDialog focuses Cancel; `returnFocusTo` used when the trigger is gone; the close button's name comes from the provider; `size` maps to the expected max width.
- **axe:** every documentation example, in both themes.
- **In the apps (browser, at the gate):** a form dialog and a delete confirmation in App A, a delete confirmation in its add-on, and a form dialog in App B.

## Migration

| App | Visible change | Code change |
| --- | --- | --- |
| App A and its add-on | the × becomes a 36 px round icon button with a hover highlight; tall dialogs scroll inside instead of overflowing the viewport | imports from `@booleanpress/ui/dialog`, `/alert-dialog`, `/sheet`; `className="sm:max-w-…"` becomes `size` where it matches; `returnFocusTo` on its delete confirmations |
| App B | the × grows from its 24 px box to the 36 px round icon button; tall dialogs scroll inside | imports change; `returnFocusTo` where a dialog removes its row |

## Decisions

Decisions 1 and 2 were taken as recommended while building the pilot, for the owner to confirm at Gate 1; decision 3 was the owner's call to let the pilot's film decide.

1. **Should dialogs get a `size` prop (small, medium, large), or keep setting widths with classes?** Decided: `size`, as recommended (`sm` 384, `md` 512, `lg` 672 px). Each screen picked its own width before; three named sizes keep dialogs consistent across products, and `className` still overrides.
2. **Should the × and Escape stay usable while a dialog is saving?** Decided: yes, as recommended. Blocking them traps the user if the request hangs; the product decides whether closing cancels the request or lets it finish.
3. **Should closing dialogs fade out (the industry norm) instead of disappearing at once?** Decided by the film (standard §6.3 rule 5): they fade out over 100 ms and hold the last keyframe. The fade without the hold repainted the panel on every close in Chrome, Firefox and WebKit; with the hold, no close repainted it (`PATCHES.md` §3).
