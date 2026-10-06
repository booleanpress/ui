import { useRef, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@booleanpress/ui/alert-dialog"
import { Button } from "@booleanpress/ui/button"

export default function AlertDialogReturnFocus() {
  const [keys, setKeys] = useState(["Production", "Staging", "Testing"])
  const heading = useRef<HTMLHeadingElement>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <h3 ref={heading} tabIndex={-1} className="text-sm font-medium outline-none">
        API keys ({keys.length})
      </h3>
      <ul className="flex flex-col gap-2">
        {keys.map((key) => (
          <li key={key} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
            {key}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  Delete<span className="sr-only"> {key} key</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent returnFocusTo={heading}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete the {key} key?</AlertDialogTitle>
                  <AlertDialogDescription>Sites that use it can no longer send email.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={() => setKeys((list) => list.filter((k) => k !== key))}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        ))}
      </ul>
    </div>
  )
}
