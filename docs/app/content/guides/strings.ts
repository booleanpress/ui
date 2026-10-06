import type { GuideDoc } from "../types.ts"

export default {
  slug: "strings",
  title: "Strings and translation",
  description: "The few words the components write themselves come from the provider, so you translate them with the rest of your app.",
  sections: [
    {
      id: "no-english-inside",
      title: "No English inside the components",
      markdown: `A component writes text of its own only where a screen reader needs a name the design does not show: the × that closes a dialog, the pagination links, the sidebar's toggle. That text comes from \`BooleanUIProvider\`, never from the component. The provider has an English default for every key; pass your translations to replace them:

\`\`\`tsx
import { BooleanUIProvider } from "@booleanpress/ui/provider"

const strings = {
  close: t("Close"),
  previousPage: t("Go to previous page"),
  nextPage: t("Go to next page"),
}

<BooleanUIProvider strings={strings}>
  <App />
</BooleanUIProvider>
\`\`\`

A key you leave out keeps its English default, so you can translate a few at a time. In a WordPress plugin, build the map with your plugin's own translation function, so the strings land in your text domain and your translators see them.`,
    },
    {
      id: "keys",
      title: "The keys",
      markdown: `| Key | English default | Used by |
| --- | --- | --- |
| \`close\` | Close | Dialog, Sheet and Confirm: the × button; Close button: its name |
| \`previous\` | Previous | Pagination: the Previous link's text, kept for screen readers |
| \`next\` | Next | Pagination: the Next link's text, kept for screen readers; Stepper and Tour: the Next button |
| \`previousPage\` | Go to previous page | Pagination: the link's name |
| \`nextPage\` | Go to next page | Pagination: the link's name |
| \`morePages\` | More pages | Pagination: the ellipsis |
| \`loading\` | Loading | Spinner; the loading state of Cascade select, Data table, Data view, Loading overlay, Statistic, Tree, Tree table and Virtual scroller |
| \`toggleSidebar\` | Toggle Sidebar | Sidebar: the trigger and the rail |
| \`sidebarTitle\` | Sidebar | Sidebar: the title of the phone-width panel |
| \`sidebarDescription\` | Displays the mobile sidebar. | Sidebar: the description of that panel |
| \`commandTitle\` | Command Palette | Command dialog: its title and the name of its search field |
| \`commandDescription\` | Search for a command to run... | Command dialog: its description |
| \`pagination\` | Pagination | Pagination: the landmark's name |
| \`breadcrumb\` | Breadcrumb | Breadcrumb: the landmark's name |
| \`more\` | More | Breadcrumb: the ellipsis |
| \`showPassword\` | Show password | Password input: the button that shows the value |
| \`notifications\` | Notifications | Toast: the region's name |
| \`closeNotification\` | Close notification | Toast: the close button |
| \`suggestions\` | Suggestions | Command: the list's name; Tags input: the suggestions list's name |
| \`maximize\` | Maximize | Dialog |
| \`restore\` | Restore | Dialog |
| \`rowsPerPage\` | Rows per page | Pagination |
| \`pageRange\` | {start}–{end} of {total} | Data table, Pagination |
| \`goToPage\` | Go to page | Pagination |
| \`firstPage\` | Go to first page | Pagination |
| \`lastPage\` | Go to last page | Pagination |
| \`clear\` | Clear | Autocomplete, Cascade select, Combobox, Date picker, Date range picker, Input, Multi-select, Select, Tree select |
| \`sliderMinimum\` | Minimum | Slider |
| \`sliderMaximum\` | Maximum | Slider |
| \`sliderValue\` | Value {index} of {count} | Slider |
| \`badgeOverflow\` | {max}+ | Badge |
| \`removeItem\` | Remove {label} | Chip, Combobox, File upload, Multi-select |
| \`scrollTabsBackward\` | Scroll tabs backward | Tabs |
| \`scrollTabsForward\` | Scroll tabs forward | Tabs |
| \`closeTab\` | Close {label} | Tabs |
| \`carouselRole\` | carousel | Carousel |
| \`slideRole\` | slide | Carousel |
| \`previousSlide\` | Previous slide | Carousel |
| \`nextSlide\` | Next slide | Carousel |
| \`slideOf\` | Slide {index} of {count} | Carousel |
| \`goToSlide\` | Go to slide {index} | Carousel |
| \`otpCharacter\` | Character {index} of {count} | Input OTP |
| \`colorPicker\` | Colour picker | Color picker |
| \`hue\` | Hue | Color picker |
| \`saturation\` | Saturation | Color picker |
| \`brightness\` | Brightness | Color picker |
| \`alpha\` | Alpha | Color picker |
| \`hexColor\` | Hex colour | Color picker |
| \`colorFormat\` | Colour format | Color picker |
| \`red\`, \`green\`, \`blue\` | Red, Green, Blue | Color channels |
| \`lightness\`, \`chroma\` | Lightness, Chroma | Color channels |
| \`cssColor\` | CSS colour | Color input |
| \`pickColor\` | Pick a colour from the screen | Eyedropper |
| \`eyeDropperUnavailable\` | Screen colour picking is unavailable in this browser | Eyedropper |
| \`eyeDropperFailed\` | The colour could not be picked | Eyedropper |
| \`colorSwatches\` | Preset colours | Color picker |
| \`ratingValue\` | {value} of {max} | Rating |
| \`ratingCleared\` | Rating cleared | Rating |
| \`selectAll\` | Select all | Checkbox group, Multi-select, Order list, Tree table |
| \`today\` | Today | Date picker |
| \`chooseDate\` | Choose date | Date picker |
| \`chooseDateRange\` | Choose dates | Date range picker |
| \`apply\` | Apply | Date range picker, Editor |
| \`cancel\` | Cancel | Confirm, Confirm popup, Date range picker, File upload, Inplace |
| \`presetToday\` | Today | Date range picker |
| \`presetYesterday\` | Yesterday | Date range picker |
| \`presetLast7Days\` | Last 7 days | Date range picker |
| \`presetLast30Days\` | Last 30 days | Date range picker |
| \`presetThisMonth\` | This month | Date range picker |
| \`presetLastMonth\` | Last month | Date range picker |
| \`rangeMinDays\` | Choose at least {count} days | Date range picker |
| \`rangeMaxDays\` | Choose at most {count} days | Date range picker |
| \`rangeDaysBetween\` | Choose {min} to {max} days | Date range picker |
| \`hour\` | Hour | Date field, Date picker, Time field |
| \`minute\` | Minute | Date field, Date picker, Time field |
| \`second\` | Second | Date field, Time field |
| \`dayPeriod\` | AM/PM | Date field, Date picker, Time field |
| \`day\` | Day | Date field, Time field |
| \`month\` | Month | Calendar (its month menu), Date field, Date picker, Date range picker, Time field |
| \`year\` | Year | Calendar (its year menu), Date field, Date picker, Date range picker, Time field |
| \`chooseYear\` | Choose year | Date picker |
| \`previousYear\` | Previous year | Date picker |
| \`nextYear\` | Next year | Date picker |
| \`previousYears\` | Previous years | Date picker |
| \`nextYears\` | Next years | Date picker |
| \`emptySegment\` | Empty | Date field, Time field |
| \`noResults\` | No results | Autocomplete, Cascade select, Combobox, Data table, Listbox, Order list, Tree, Tree select, Tree table |
| \`loadingResults\` | Loading results… | Autocomplete, Combobox |
| \`toggleOptions\` | Show options | Autocomplete, Combobox, Multi-select |
| \`filterOptions\` | Filter options | Listbox, Multi-select, Order list |
| \`selectedCount\` | {count} selected | Action bar, Data table, Multi-select, Tree select |
| \`moreSelected\` | +{count} more | Multi-select, Tree select |
| \`increment\` | Increase | Input number |
| \`decrement\` | Decrease | Input number |
| \`numberFieldRole\` | Number field | Input number |
| \`search\` | Search | Data table, Search field |
| \`passwordStrength\` | Password strength: {level} | Password input |
| \`strengthWeak\` | Weak | Password input |
| \`strengthMedium\` | Medium | Password input |
| \`strengthStrong\` | Strong | Password input |
| \`strengthVeryStrong\` | Very strong | Password input |
| \`strengthTooWeak\` | Too weak | Password input |
| \`strengthFair\` | Fair | Password input |
| \`passwordStrengthTitle\` | Password strength | Password input |
| \`ruleMet\` | {label}: met | Password input |
| \`ruleNotMet\` | {label}: not met | Password input |
| \`toggleContent\` | Show or hide {title} | Panel |
| \`stepOf\` | Step {current} of {total} | Stepper |
| \`stepCompleted\` | Completed | Stepper |
| \`stepError\` | Has errors | Stepper |
| \`back\` | Back | Stepper, Tour |
| \`finish\` | Finish | Stepper, Tour |
| \`speedDialActions\` | Actions | Speed dial |
| \`scrollToTop\` | Scroll to top | Scroll top |
| \`moreActions\` | More actions | Page header, Toolbar |
| \`expandNode\` | Expand {label} | Tree table |
| \`collapseNode\` | Collapse {label} | Tree table |
| \`filterTree\` | Filter | Tree, Tree select |
| \`expandAll\` | Expand all | Tree table |
| \`collapseAll\` | Collapse all | Tree table |
| \`treeLoading\` | Loading {label} | Tree, Tree table |
| \`chooseFiles\` | Choose | File upload |
| \`upload\` | Upload | File upload |
| \`dropFilesHere\` | Drop files here | File upload |
| \`browseFiles\` | or click to browse | File upload |
| \`uploadComplete\` | Upload complete | File upload |
| \`uploadFailed\` | Upload failed | File upload |
| \`fileTooLarge\` | {name} is larger than {size} | File upload |
| \`fileTypeNotAllowed\` | {name} is not an allowed file type | File upload |
| \`tooManyFiles\` | Too many files: you can add {count} at most | File upload |
| \`fileAdded\` | {name} added | File upload |
| \`filesAdded\` | {count} files added | File upload |
| \`folderNotAllowed\` | {name} is a folder: add the files inside it | File upload: a dropped folder |
| \`layout\` | Layout | Data view |
| \`layoutList\` | List | Data view |
| \`layoutGrid\` | Grid | Data view |
| \`sortBy\` | Sort by | Data view |
| \`noItems\` | No items | Data view, Order list, Pick list, Virtual scroller |
| \`trendUp\` | Up {value} | Statistic |
| \`trendDown\` | Down {value} | Statistic |
| \`sortAscending\` | ascending | Data table |
| \`sortDescending\` | descending | Data table |
| \`sortNone\` | Not sorted | Data table |
| \`sortedBy\` | Sorted by {column}, {direction} | Data table |
| \`resultsCount\` | {count} results | Data table |
| \`selectRow\` | Select row {name} | Data table |
| \`selectAllRows\` | Select all rows on this page | Data table |
| \`expandRow\` | Expand row {name} | Data table |
| \`collapseRow\` | Collapse row {name} | Data table |
| \`resizeColumn\` | Resize {column} | Data table |
| \`columnMenu\` | {column} options | Data table |
| \`moveColumnLeft\` | Move left | Data table |
| \`moveColumnRight\` | Move right | Data table |
| \`hideColumn\` | Hide column | Data table |
| \`filterColumn\` | Filter {column} | Data table |
| \`editCell\` | Edit {column} | Data table |
| \`rowActions\` | Actions for {name} | Data table |
| \`columns\` | Columns | Data table |
| \`exportCsv\` | Export CSV | Data table |
| \`noRows\` | No rows | Data table |
| \`confirm\` | Confirm | Confirm, Confirm popup |
| \`confirmTitle\` | Are you sure? | Confirm |
| \`delete\` | Delete | Confirm, Confirm popup |
| \`dismiss\` | Dismiss | Banner |
| \`clearSelection\` | Clear selection | Action bar |
| \`edit\` | Edit {label} | Inplace |
| \`save\` | Save | Inplace |
| \`saving\` | Saving… | Inplace |
| \`saveFailed\` | The change could not be saved. | Inplace |
| \`skipTour\` | Skip tour | Tour |
| \`tourStep\` | {current} of {total} | Tour |
| \`opensInNewTab\` | (opens in a new tab) | Link |
| \`copy\` | Copy | Copy button, Code block |
| \`copied\` | Copied | Copy button |
| \`copyFailed\` | Copy failed | Copy button |
| \`wrapLines\` | Wrap lines | Code block |
| \`codeBlock\` | {title} code | Code block |
| \`chatThread\` | Conversation | Chat |
| \`newMessages\` | New messages | Chat |
| \`chatMessage\` | Message | Chat |
| \`sendMessage\` | Send message | Chat |
| \`attachFile\` | Attach file | Chat |
| \`typing\` | {name} is typing | Chat |
| \`messageSending\` | Sending | Chat |
| \`messageSent\` | Sent | Chat |
| \`messageFailed\` | Not sent | Chat |
| \`retry\` | Retry | Chat |
| \`editorToolbar\` | Formatting | Editor |
| \`textStyle\` | Text style | Editor |
| \`paragraph\` | Paragraph | Editor |
| \`heading\` | Heading {level} | Editor |
| \`bold\` | Bold | Editor |
| \`italic\` | Italic | Editor |
| \`underline\` | Underline | Editor |
| \`strikethrough\` | Strikethrough | Editor |
| \`inlineCode\` | Code | Editor |
| \`bulletList\` | Bulleted list | Editor |
| \`orderedList\` | Numbered list | Editor |
| \`blockquote\` | Quote | Editor |
| \`link\` | Link | Editor |
| \`linkUrl\` | Link address | Editor |
| \`invalidLink\` | Enter a full address, such as https://example.com | Editor |
| \`removeLink\` | Remove link | Editor |
| \`undo\` | Undo | Editor |
| \`redo\` | Redo | Editor |
| \`characters\` | {count} characters | Editor |
| \`characterCount\` | {count} of {max} characters | Editor |
| \`monthNavigation\` | Month navigation | Calendar |
| \`previousMonth\` | Previous month | Calendar |
| \`nextMonth\` | Next month | Calendar |
| \`todayDate\` | Today, {date} | Calendar |
| \`selectedDate\` | {date}, selected | Calendar |
| \`weekNumber\` | Week {week} | Calendar |
| \`weekNumberHeader\` | Week number | Calendar |
| \`moveUp\` | Move up | Order list |
| \`moveDown\` | Move down | Order list |
| \`moveToTop\` | Move to top | Order list |
| \`moveToBottom\` | Move to bottom | Order list |
| \`moveToTarget\` | Move to target | Pick list |
| \`moveAllToTarget\` | Move all to target | Pick list |
| \`moveToSource\` | Move to source | Pick list |
| \`moveAllToSource\` | Move all to source | Pick list |
| \`itemMoved\` | {item} moved to position {position} of {total} | Data table, Order list, Pick list, Tree |
| \`itemsMoved\` | {count} items moved; the first is now at position {position} of {total} | Order list, Pick list |
| \`dragHandle\` | Drag {item} | Data table, Order list |
| \`dragStarted\` | Picked up {item} at position {position} of {total}. Arrow keys move it, Space or Enter drops it, Escape cancels. | Data table, Order list |
| \`dragCancelled\` | Move cancelled. {item} is back at position {position} of {total}. | Data table, Order list |
| \`sourceList\` | Source | Pick list |
| \`targetList\` | Target | Pick list |
| \`loadingMore\` | Loading more… | Virtual scroller |
| \`loadFailed\` | Could not load the options | Cascade select: a level that failed to load |
| \`treeLoadFailed\` | Could not load {label} | Tree, Tree select, Tree table: children that failed to load |
| \`actionFailed\` | Something went wrong. Try again. | Confirm, Confirm popup: an \`onConfirm\` that failed without a message |

Each component page lists the keys it reads under **API**. A new key always arrives with an English default, in a minor version, so an update never leaves a name empty.`,
    },
    {
      id: "test-with-the-pseudo-locale",
      title: "Test with the pseudo-locale",
      markdown: `A pseudo-locale replaces every letter with an accented one and brackets the result: \`Close\` becomes \`[Ćĺóšé]\`. Text that stays plain English was not translated; text that is cut off or overlaps needs more room, as German or Finnish will. Try it on this site with ⚙ → **Strings** → **Pseudo-locale**.`,
    },
    {
      id: "dates-and-numbers",
      title: "Dates and numbers",
      markdown: `Give the provider the site's locale and time zone, and every component that writes a number or a date uses them: the calendar's month and day names and its first day of the week, the date and time fields, the number field, pagination's range, file sizes, statistics and relative times.

\`\`\`tsx
<BooleanUIProvider locale="de-DE" timeZone="Europe/Berlin">
\`\`\`

An app rendered on the server passes \`locale\`: without it, the server and a reader's browser can format the same date differently, and React reports a hydration mismatch. A DayPicker \`locale\` passed to the Calendar itself still wins. For numbers and dates in your own text, use \`@booleanpress/ui/format\` (\`FormatNumber\`, \`FormatDate\`, \`FormatRelativeTime\` and the plain functions), which read the same settings.`,
    },
  ],
} satisfies GuideDoc
