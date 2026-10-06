import { Prose } from "@booleanpress/ui/typography"

const ROWS = [
  ["Delivered", "The receiving server accepted the message.", "1,284"],
  ["Deferred", "The server asked us to try again later.", "12"],
  ["Bounced", "The server refused the message for good.", "7"],
]

export default function TypographyTableInProse() {
  return (
    <Prose className="w-full max-w-xl">
      <h3>Delivery states</h3>
      <p>Every message in the log is in one of three states.</p>
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Meaning</th>
            <th>Today</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([state, meaning, count]) => (
            <tr key={state}>
              <td>
                <code>{state.toLowerCase()}</code>
              </td>
              <td>{meaning}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Prose>
  )
}
