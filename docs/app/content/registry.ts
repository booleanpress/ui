// Every page of the site, in the order the left column lists them, and the paths pre-rendered at build time.
import { CATEGORIES, type Category, type ComponentDoc, type GuideDoc } from "./types.ts"
import accordion from "./components/accordion.ts"
import actionBar from "./components/action-bar.ts"
import alert from "./components/alert.ts"
import alertDialog from "./components/alert-dialog.ts"
import aspectRatio from "./components/aspect-ratio.ts"
import autocomplete from "./components/autocomplete.ts"
import avatar from "./components/avatar.ts"
import badge from "./components/badge.ts"
import banner from "./components/banner.ts"
import breadcrumb from "./components/breadcrumb.ts"
import button from "./components/button.ts"
import buttonGroup from "./components/button-group.ts"
import calendar from "./components/calendar.ts"
import card from "./components/card.ts"
import carousel from "./components/carousel.ts"
import cascadeSelect from "./components/cascade-select.ts"
import chart from "./components/chart.ts"
import chat from "./components/chat.ts"
import checkbox from "./components/checkbox.ts"
import checkboxGroup from "./components/checkbox-group.ts"
import chip from "./components/chip.ts"
import choiceCard from "./components/choice-card.ts"
import closeButton from "./components/close-button.ts"
import codeBlock from "./components/code-block.ts"
import collapsible from "./components/collapsible.ts"
import colorPicker from "./components/color-picker.ts"
import combobox from "./components/combobox.ts"
import command from "./components/command.ts"
import confirm from "./components/confirm.ts"
import confirmPopup from "./components/confirm-popup.ts"
import contextMenu from "./components/context-menu.ts"
import copyButton from "./components/copy-button.ts"
import dataTable from "./components/data-table.ts"
import dataView from "./components/data-view.ts"
import dateField from "./components/date-field.ts"
import datePicker from "./components/date-picker.ts"
import dateRangePicker from "./components/date-range-picker.ts"
import descriptionList from "./components/description-list.ts"
import dialog from "./components/dialog.ts"
import drawer from "./components/drawer.ts"
import dropdownMenu from "./components/dropdown-menu.ts"
import editor from "./components/editor.ts"
import empty from "./components/empty.ts"
import field from "./components/field.ts"
import fieldset from "./components/fieldset.ts"
import fileUpload from "./components/file-upload.ts"
import floatLabel from "./components/float-label.ts"
import format from "./components/format.ts"
import hoverCard from "./components/hover-card.ts"
import iconButton from "./components/icon-button.ts"
import inFieldLabel from "./components/in-field-label.ts"
import inplace from "./components/inplace.ts"
import input from "./components/input.ts"
import inputGroup from "./components/input-group.ts"
import inputMask from "./components/input-mask.ts"
import inputNumber from "./components/input-number.ts"
import inputOtp from "./components/input-otp.ts"
import item from "./components/item.ts"
import kbd from "./components/kbd.ts"
import knob from "./components/knob.ts"
import label from "./components/label.ts"
import link from "./components/link.ts"
import listbox from "./components/listbox.ts"
import loadingOverlay from "./components/loading-overlay.ts"
import menubar from "./components/menubar.ts"
import meterGroup from "./components/meter-group.ts"
import multiSelect from "./components/multi-select.ts"
import nativeSelect from "./components/native-select.ts"
import navigationMenu from "./components/navigation-menu.ts"
import orderList from "./components/order-list.ts"
import overlayBadge from "./components/overlay-badge.ts"
import pageHeader from "./components/page-header.ts"
import pagination from "./components/pagination.ts"
import panel from "./components/panel.ts"
import passwordInput from "./components/password-input.ts"
import pickList from "./components/pick-list.ts"
import popover from "./components/popover.ts"
import progress from "./components/progress.ts"
import progressCircle from "./components/progress-circle.ts"
import radioGroup from "./components/radio-group.ts"
import rating from "./components/rating.ts"
import scrollArea from "./components/scroll-area.ts"
import scrollTop from "./components/scroll-top.ts"
import searchField from "./components/search-field.ts"
import segmentedControl from "./components/segmented-control.ts"
import select from "./components/select.ts"
import separator from "./components/separator.ts"
import sheet from "./components/sheet.ts"
import sidebar from "./components/sidebar.ts"
import skeleton from "./components/skeleton.ts"
import slider from "./components/slider.ts"
import sonner from "./components/sonner.ts"
import speedDial from "./components/speed-dial.ts"
import spinner from "./components/spinner.ts"
import splitter from "./components/splitter.ts"
import statistic from "./components/statistic.ts"
import stepper from "./components/stepper.ts"
import switchDoc from "./components/switch.ts"
import table from "./components/table.ts"
import tabs from "./components/tabs.ts"
import tagsInput from "./components/tags-input.ts"
import textarea from "./components/textarea.ts"
import timeField from "./components/time-field.ts"
import timeline from "./components/timeline.ts"
import toggle from "./components/toggle.ts"
import toggleGroup from "./components/toggle-group.ts"
import toolbar from "./components/toolbar.ts"
import tooltip from "./components/tooltip.ts"
import tour from "./components/tour.ts"
import tree from "./components/tree.ts"
import treeSelect from "./components/tree-select.ts"
import treeTable from "./components/tree-table.ts"
import typography from "./components/typography.ts"
import virtualScroller from "./components/virtual-scroller.ts"
import introductionGuide from "./guides/introduction.ts"
import installationGuide from "./guides/installation.ts"
import themingGuide from "./guides/theming.ts"
import darkModeGuide from "./guides/dark-mode.ts"
import rightToLeftGuide from "./guides/right-to-left.ts"
import stringsGuide from "./guides/strings.ts"
import formsGuide from "./guides/forms.ts"
import motionGuide from "./guides/motion.ts"
import accessibilityGuide from "./guides/accessibility.ts"
import browserSupportGuide from "./guides/browser-support.ts"
import contributingGuide from "./guides/contributing.ts"
import changelogGuide from "./guides/changelog.ts"
import componentStatusGuide from "./guides/component-status.ts"
import type { BlockDoc } from "./blocks/types.ts"
import signInBlock from "./blocks/sign-in.ts"
import settingsPageBlock from "./blocks/settings-page.ts"
import tablePageBlock from "./blocks/table-page.ts"
import dashboardBlock from "./blocks/dashboard.ts"

export const guides: GuideDoc[] = [
  introductionGuide,
  installationGuide,
  themingGuide,
  darkModeGuide,
  rightToLeftGuide,
  stringsGuide,
  formsGuide,
  motionGuide,
  accessibilityGuide,
  browserSupportGuide,
  contributingGuide,
  changelogGuide,
  componentStatusGuide,
]

export const components: ComponentDoc[] = [
  accordion,
  actionBar,
  alert,
  alertDialog,
  aspectRatio,
  autocomplete,
  avatar,
  badge,
  banner,
  breadcrumb,
  button,
  buttonGroup,
  calendar,
  card,
  carousel,
  cascadeSelect,
  chart,
  chat,
  checkbox,
  checkboxGroup,
  chip,
  choiceCard,
  closeButton,
  codeBlock,
  collapsible,
  colorPicker,
  combobox,
  command,
  confirm,
  confirmPopup,
  contextMenu,
  copyButton,
  dataTable,
  dataView,
  dateField,
  datePicker,
  dateRangePicker,
  descriptionList,
  dialog,
  drawer,
  dropdownMenu,
  editor,
  empty,
  field,
  fieldset,
  fileUpload,
  floatLabel,
  format,
  hoverCard,
  iconButton,
  inFieldLabel,
  inplace,
  input,
  inputGroup,
  inputMask,
  inputNumber,
  inputOtp,
  item,
  kbd,
  knob,
  label,
  link,
  listbox,
  loadingOverlay,
  menubar,
  meterGroup,
  multiSelect,
  nativeSelect,
  navigationMenu,
  orderList,
  overlayBadge,
  pageHeader,
  pagination,
  panel,
  passwordInput,
  pickList,
  popover,
  progress,
  progressCircle,
  radioGroup,
  rating,
  scrollArea,
  scrollTop,
  searchField,
  segmentedControl,
  select,
  separator,
  sheet,
  sidebar,
  skeleton,
  slider,
  sonner,
  speedDial,
  spinner,
  splitter,
  statistic,
  stepper,
  switchDoc,
  table,
  tabs,
  tagsInput,
  textarea,
  timeField,
  timeline,
  toggle,
  toggleGroup,
  toolbar,
  tooltip,
  tour,
  tree,
  treeSelect,
  treeTable,
  typography,
  virtualScroller,
].sort((a, b) => a.title.localeCompare(b.title))

/** The blocks, whole screens to copy, in the order the left column lists them. */
export const blocks: BlockDoc[] = [signInBlock, settingsPageBlock, tablePageBlock, dashboardBlock]

/** The folder of examples/ that holds the blocks' code, so a block's own page is /examples/blocks/<slug>. */
export const BLOCKS = "blocks"

export interface NavItem {
  title: string
  href: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const guideHref = (slug: string) => `/docs/${slug}`
export const componentHref = (slug: string) => `/components/${slug}`
export const exampleHref = (slug: string, example: string) => `/examples/${slug}/${example}`
export const blockHref = (slug: string) => `/blocks/${slug}`

/** The site's three sections, each with its own list in the left column. */
export type Section = "docs" | "blocks" | "components"

/** The section an address belongs to: /docs/…, /blocks/…, or the components (the default). */
export const sectionOf = (pathname: string): Section =>
  pathname.startsWith("/docs/") ? "docs" : pathname.startsWith("/blocks/") ? "blocks" : "components"

/** The groups of one section, or of all three in reading order: Get started, the blocks, then each category. */
export function navigation(section?: Section): NavGroup[] {
  const groups: NavGroup[] = []
  if (!section || section === "docs") groups.push({ title: "Get started", items: guides.map((g) => ({ title: g.title, href: guideHref(g.slug) })) })
  if (!section || section === "blocks") groups.push({ title: "Blocks", items: blocks.map((b) => ({ title: b.title, href: blockHref(b.slug) })) })
  if (!section || section === "components") {
    for (const category of CATEGORIES as readonly Category[]) {
      const items = components.filter((c) => c.category === category).map((c) => ({ title: c.title, href: componentHref(c.slug) }))
      if (items.length) groups.push({ title: category, items })
    }
  }
  return groups
}

/** The pages in reading order, for the previous and next links. */
export function readingOrder(): NavItem[] {
  return navigation().flatMap((group) => group.items)
}

export function neighbours(href: string): { previous?: NavItem; next?: NavItem } {
  const order = readingOrder()
  const index = order.findIndex((item) => item.href === href)
  return { previous: order[index - 1], next: order[index + 1] }
}

export const findComponent = (slug: string) => components.find((c) => c.slug === slug)
export const findGuide = (slug: string) => guides.find((g) => g.slug === slug)
export const findBlock = (slug: string) => blocks.find((b) => b.slug === slug)

/** Every path written to static HTML (or to a text file, for the Markdown and llms.txt). */
export function prerenderPaths(): string[] {
  return [
    "/",
    "/404",
    "/llms.txt",
    ...guides.flatMap((g) => [guideHref(g.slug), `${guideHref(g.slug)}.md`]),
    ...blocks.flatMap((b) => [blockHref(b.slug), `${blockHref(b.slug)}.md`, exampleHref(BLOCKS, b.slug)]),
    ...components.flatMap((c) => [
      componentHref(c.slug),
      `${componentHref(c.slug)}.md`,
      ...c.examples.map((e) => exampleHref(c.slug, e.id)),
    ]),
  ]
}
