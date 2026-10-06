// InFieldLabel: built on a plain wrapper round one field and its native label; the label stays in the field's top.
import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * A small label fixed inside the top of its field, above the value. Wrap one field and its `<label htmlFor>`: an Input,
 * InputNumber, InputMask, Textarea, PasswordInput, InputGroup, NativeSelect or Select.
 *
 * @since 0.1.0
 */
function InFieldLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="in-field-label"
      className={cn(
        "relative block in-data-[slot=input-group]:flex-1 in-data-[slot=input-group]:self-stretch",
        // The field grows to 47px: 18px above the text for the label, 6px below it. An InputNumber's prefix and suffix move
        // down with its number.
        "[&_:is([data-slot=input],[data-slot=input-mask],[data-slot=input-number-input],[data-slot=input-number-prefix],[data-slot=input-number-suffix],[data-slot=textarea],[data-slot=input-group-control],[data-slot=native-select],[data-slot=select-trigger])]:pt-[1.125rem] [&_:is([data-slot=input],[data-slot=input-mask],[data-slot=input-number-input],[data-slot=input-number-prefix],[data-slot=input-number-suffix],[data-slot=textarea],[data-slot=input-group-control],[data-slot=native-select],[data-slot=select-trigger])]:pb-1.5",
        // A select's chevron stays centred in the whole field; an icon or a button beside the text lines up with it.
        "[&_[data-slot=select-trigger]>svg]:-mt-3 [&_[data-slot=input-group]>[data-align^=inline]:has(>svg,>button:not([role]))]:mt-3",
        // The label: 10px, at the field's start padding, 6px from its top, in the muted colour.
        "[&>label]:pointer-events-none [&>label]:absolute [&>label]:start-2.5 [&>label]:top-1.5 [&>label]:z-1 [&>label]:text-[0.625rem] [&>label]:leading-none [&>label]:font-normal [&>label]:text-muted-foreground [&>label]:transition-colors [&>label]:duration-(--bui-duration-control) [&>label]:ease-(--bui-ease-standard)",
        "has-[:is(input,textarea,select,[role=combobox])[data-size=sm]]:[&>label]:start-2 has-[:is(input,textarea,select,[role=combobox])[data-size=lg]]:[&>label]:start-3",
        // An InputNumber with buttons on both sides: the label starts past the 36px minus button.
        "has-[>[data-slot=input-number][data-buttons=horizontal]]:[&>label]:start-11.5 has-[>[data-slot=input-number][data-buttons=horizontal][data-size=sm]]:[&>label]:start-11 has-[>[data-slot=input-number][data-buttons=horizontal][data-size=lg]]:[&>label]:start-12",
        // Focus (and an open list) colours the label; invalid colours it red, focused or not.
        "[&:is(:focus-within,:has([role=combobox][data-state=open])):not(:has([aria-invalid=true]))>label]:text-secondary-foreground",
        "has-[[aria-invalid=true]]:[&>label]:text-destructive-strong",
        className
      )}
      {...props}
    />
  )
}

export { InFieldLabel }
