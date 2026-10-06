import type { BlockDoc } from "./types.ts"

export default {
  slug: "table-page",
  title: "Table page",
  purpose: "A list screen: a page header, a toolbar that searches and filters, a data table whose rows can be selected and acted on, and pagination.",
  usage: `The page header names the list and holds its main action. The table's own toolbar searches every column; the selects beside it filter the rows before they reach the table. Selecting rows, with the checkboxes or by pressing a row, brings up the action bar over the table, whose buttons act on the selection and clear it.

When you copy it, replace the rows with yours and give \`getRowId\` their real ids, so the selection follows a ticket and not its position. For a long list, move the search, filters and pages to your server with \`manualFiltering\` and \`manualPagination\`.`,
  frameHeight: 820,
} satisfies BlockDoc
