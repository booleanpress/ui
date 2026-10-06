import { Inplace } from "@booleanpress/ui/inplace"

// Stands in for the request that saves the subject: a subject that mentions "free" is refused.
const saveSubject = (value: string) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(
      () => (/free/i.test(value) ? reject(new Error("Subjects with “free” are refused by the spam filter.")) : resolve()),
      1200
    )
  )

export default function InplaceAsyncSave() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1">
      <span className="ps-2.5 text-xs font-medium text-muted-foreground uppercase">Subject</span>
      <Inplace label="Subject" defaultValue="Your October invoice" onSave={saveSubject} className="w-full" />
      <p className="ps-2.5 text-xs text-muted-foreground">Try a subject with the word “free” to see the error.</p>
    </div>
  )
}
