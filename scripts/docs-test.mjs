// Browser tests of the documentation site: axe on every pre-rendered page in light and dark, then the behaviours a
// reader relies on — navigation, the examples' tabs and copy button, the settings, search, the phone layout.
//
// Usage: node scripts/docs-test.mjs <base URL> [--quiet]
// Reports unexpected axe violations, documented contrast findings, and behavior results; exits 1 on any unexpected failure.
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const base = (process.argv[2] ?? 'http://127.0.0.1:5181').replace(/\/$/, '');
const quiet = process.argv.includes('--quiet');
const axePath = require.resolve('axe-core/axe.min.js');
const failures = [];
let behaviours = 0;
let documentedContrastFindings = 0;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });

async function freshPage(settings, viewport) {
    const page = await context.newPage();
    if (viewport) await page.setViewportSize(viewport);
    // Seed the settings once per page, not on every navigation, so a change made by a test survives it.
    await page.addInitScript((s) => {
        if (window.top !== window || window.sessionStorage.getItem('bui-test-seeded')) return;
        window.sessionStorage.setItem('bui-test-seeded', '1');
        window.localStorage.setItem('bui-docs:settings', JSON.stringify(s));
    }, settings ?? {});
    page.on('pageerror', (error) => failures.push(`page error on ${page.url()}: ${error.message}`));
    return page;
}

// A component page shows several examples of the same component, so a landmark component (Breadcrumb, Pagination, the
// calendar's navigation, the toast region) appears there several times under one name. On those pages only,
// landmark-unique is off: each example is also checked alone, on its own page, with every rule on.

async function axe(page, label, { repeatsExamples = false } = {}) {
    await page.addScriptTag({ path: axePath });
    const result = await page.evaluate(async ({ repeats }) => {
        const rules = repeats ? { 'landmark-unique': { enabled: false } } : {};
        const run = await window.axe.run(document, { resultTypes: ['violations'], rules });
        let documented = 0;
        const violations = run.violations.flatMap((v) => {
            // Requested default appearances include documented AA contrast exceptions. Keep scanning them, accept only the exact
            // documented colour pair on the relevant part, and report their count separately. All other findings fail.
            const nodes = v.nodes.filter((n) => {
                if (v.id !== 'color-contrast' || n.target.length !== 1 || typeof n.target[0] !== 'string') return true;
                const element = document.querySelector(n.target[0]);
                const measured = n.any.find(({ data }) => data?.fgColor)?.data;
                const toggle = element?.closest('[data-slot="toggle-indicator"]')?.closest('[data-state="off"]');
                const rule = element?.closest('[data-slot="password-input-rule"]');
                const addon = element?.closest('[data-slot="input-group-text"]')?.closest('[data-slot="input-group"][data-attached="true"]');
                const known = measured && (
                    (toggle && measured.fgColor === '#64748b' && measured.bgColor === '#f1f5f9') ||
                    (rule && measured.fgColor === '#707a88' && measured.bgColor === '#ffffff') ||
                    (addon && measured.fgColor === '#94a3b8' && measured.bgColor === '#ffffff')
                );
                if (known) documented += 1;
                return !known;
            });
            if (!nodes.length) return [];
            // A contrast finding says what axe measured: text colour, background and ratio.
            const colours = (n) => n.any.map(({ data }) => (data?.fgColor ? ` (${data.fgColor} on ${data.bgColor}, ${data.contrastRatio}:1)` : '')).join('');
            return [`${v.impact} ${v.id}: ${nodes.slice(0, 3).map((n) => n.target.join(' ') + colours(n)).join(' | ')}`];
        });
        return { violations, documented };
    }, { repeats: repeatsExamples });
    documentedContrastFindings += result.documented;
    for (const violation of result.violations) failures.push(`axe ${label}: ${violation}`);
    return result.violations.length;
}

async function behaviour(name, run) {
    try {
        await run();
        behaviours += 1;
        if (!quiet) console.log(`  ok  ${name}`);
    } catch (error) {
        failures.push(`${name}: ${error.message.split('\n')[0]}`);
    }
}

const expect = (condition, message) => {
    if (!condition) throw new Error(message);
};

/** Waits up to five seconds for an async condition, as a person would wait for the page to respond. */
async function until(check, message, timeout = 5000) {
    const end = Date.now() + timeout;
    for (;;) {
        try {
            if (await check()) return;
        } catch {
            /* not there yet */
        }
        if (Date.now() > end) throw new Error(message);
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}

// 1. Every page, from the site's own index, in light and dark.
const llms = await (await fetch(`${base}/llms.txt`)).text();
const pagePaths = [
    '/',
    '/404',
    ...[...llms.matchAll(/\]\((?:https?:\/\/[^/]+)?(\/[^)]+)\.md\)/g)].map((m) => m[1]),
];
const examplePaths = [];
let axeViolations = 0;

/** Runs the jobs four at a time, each on a page of its own. */
async function pool(jobs, run) {
    const queue = [...jobs];
    await Promise.all(Array.from({ length: 4 }, async () => {
        for (let job = queue.shift(); job; job = queue.shift()) await run(job);
    }));
}

/**
 * Waits until the page has hydrated with its settings, then two frames, so the effects that follow the first render (a
 * scrolling box that takes the focus once it overflows) have run: a slower machine is otherwise scanned before them.
 */
async function settled(page, label) {
    try {
        await page.locator('html[data-ready]').waitFor({ state: 'attached', timeout: 30000 });
        await page.evaluate(() => new Promise((ready) => requestAnimationFrame(() => requestAnimationFrame(ready))));
    } catch {
        failures.push(`${label}: the page did not finish hydrating within 30 seconds`);
    }
}

await pool(pagePaths.flatMap((path) => ['light', 'dark'].map((theme) => [path, theme])), async ([path, theme]) => {
    // The theme comes from the address, not from local storage, which the pages open at the same time share.
    const page = await freshPage({});
    const response = await page.goto(`${base}${path}?theme=${theme}`, { waitUntil: 'networkidle' });
    if (path !== '/404') expect(response.ok(), `${path} answered ${response.status()}`);
    await settled(page, `${path} (${theme})`);
    await page.waitForTimeout(150);
    axeViolations += await axe(page, `${path} (${theme})`, { repeatsExamples: path.startsWith('/components/') });
    if (theme === 'light') {
        for (const href of await page.$$eval('iframe, [data-example]', (els) => els.map((e) => e.getAttribute('data-example')).filter(Boolean))) {
            examplePaths.push(`/examples/${href}`);
        }
    }
    await page.close();
});
await pool([...new Set(examplePaths)], async (path) => {
    const page = await freshPage({});
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await settled(page, path);
    axeViolations += await axe(page, path);
    await page.close();
});
const pageCount = pagePaths.length + new Set(examplePaths).size;

// 2. The behaviours a reader relies on.
const component = pagePaths.find((p) => p === '/components/checkbox') ?? pagePaths.find((p) => p.startsWith('/components/'));

await behaviour('the left column highlights the current page and survives reload and Back', async () => {
    const page = await freshPage({});
    await page.goto(base + component, { waitUntil: 'networkidle' });
    const nav = page.getByRole('navigation', { name: 'Components and guides' });
    expect((await nav.locator('[aria-current="page"]').textContent()) === 'Checkbox', 'Checkbox is not highlighted');
    await nav.getByRole('link', { name: 'Dialog', exact: true }).click();
    await page.waitForURL('**/components/dialog');
    await until(async () => (await nav.locator('[aria-current="page"]').textContent()) === 'Dialog', 'Dialog is not highlighted after the click');
    await page.reload({ waitUntil: 'networkidle' });
    expect(await page.getByRole('heading', { level: 1, name: 'Dialog' }).isVisible(), 'reload lost the page');
    await page.goBack({ waitUntil: 'networkidle' });
    expect(page.url().endsWith('/components/checkbox'), `Back went to ${page.url()}`);
    await page.close();
});

await behaviour('the right column highlights the section being read', async () => {
    const page = await freshPage({});
    await page.goto(base + component, { waitUntil: 'networkidle' });
    const toc = page.getByRole('navigation', { name: 'On this page' }).last();
    // The example's heading 100 px from the top, above the reading line; its frame keeps the next heading below it.
    await page.evaluate(() => window.scrollTo(0, document.getElementById('example-custom-indicator').getBoundingClientRect().top + window.scrollY - 100));
    await until(async () => (await toc.locator('[aria-current="location"]').textContent()) === 'Custom indicator', 'Custom indicator is not highlighted after scrolling to it');
    await page.close();
});

await behaviour('API Reference in the right column jumps to the API, the last section of the page', async () => {
    const page = await freshPage({});
    await page.goto(base + component, { waitUntil: 'networkidle' });
    await page.getByRole('navigation', { name: 'Resources' }).getByRole('link', { name: 'API Reference' }).click();
    await until(() => page.url().endsWith('#api'), 'the link did not go to #api');
    const api = page.locator('section[aria-labelledby="api"]');
    await until(() => api.getByRole('table', { name: 'Checkbox props' }).isVisible(), 'the API section has no Checkbox props table');
    expect(await page.evaluate(() => document.querySelector('section[aria-labelledby="api"]') === [...document.querySelectorAll('main section[aria-labelledby]')].filter((s) => !s.parentElement.closest('section')).pop()), 'the API is not the last section');
    await page.close();
});

await behaviour('the left column lists the current section only: components on a component page, guides on a guide', async () => {
    const page = await freshPage({});
    const nav = page.getByRole('navigation', { name: 'Components and guides' });
    await page.goto(base + component, { waitUntil: 'networkidle' });
    expect((await nav.getByRole('link', { name: 'Introduction', exact: true }).count()) === 0, 'a component page lists the guides');
    await page.goto(`${base}/docs/introduction`, { waitUntil: 'networkidle' });
    expect((await nav.getByRole('link', { name: 'Checkbox', exact: true }).count()) === 0, 'a guide lists the components');
    await page.close();
});

await behaviour('the preview opens its code with imports from its code button, copies it, and works by keyboard and label', async () => {
    const page = await freshPage({});
    await page.goto(base + component, { waitUntil: 'networkidle' });
    const block = page.locator('section[aria-label="Preview"]');
    const toggle = block.getByRole('button', { name: 'Code of the preview', exact: true });
    expect((await toggle.getAttribute('aria-expanded')) === 'false', 'the preview\'s code is open before its button is pressed');
    await toggle.click();
    const code = await block.getByRole('region', { name: 'Preview: code' }).textContent();
    expect(code.includes('import { Checkbox } from "@booleanpress/ui/checkbox"'), 'the code lacks its import');
    await block.getByRole('button', { name: 'Copy the code of the preview' }).click();
    await until(() => block.getByText('Copied').isVisible(), 'no "Copied"');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.startsWith('import'), 'the clipboard does not hold the code');
    const box = block.getByRole('checkbox', { name: 'Accept the terms' });
    await box.focus();
    await page.keyboard.press('Space');
    await until(async () => (await box.getAttribute('aria-checked')) === 'true', 'Space did not check it');
    await block.locator('.bui-example').getByText('Accept the terms').click();
    await until(async () => (await box.getAttribute('aria-checked')) === 'false', 'the label did not toggle it');
    await page.close();
});

await behaviour('an example\'s code opens on its first three lines; "View Code" opens it in a box that scrolls, the toolbar closes it again', async () => {
    const page = await freshPage({});
    await page.goto(`${base}/components/autocomplete`, { waitUntil: 'networkidle' });
    const block = page.locator('section[aria-labelledby="example-async"]');
    const region = block.getByRole('region', { name: /: code$/ });
    const height = () => region.evaluate((element) => element.getBoundingClientRect().height);
    expect((await height()) <= 96, `the closed code is ${await height()}px tall`);
    await block.getByRole('button', { name: 'View Code' }).click();
    await until(async () => (await height()) > 200, 'View Code did not open the code');
    expect(Math.abs((await height()) - 300) < 1 && (await region.evaluate((element) => element.scrollHeight)) > 300, 'the open code is not a 300px box that scrolls');
    await until(() => region.evaluate((element) => element === document.activeElement), 'focus did not move into the opened code');
    const toggle = block.getByRole('button', { name: 'Code of Async', exact: true });
    expect((await toggle.getAttribute('aria-expanded')) === 'true', 'the toolbar toggle does not say it is open');
    await toggle.click();
    await until(async () => (await height()) <= 96, 'the toolbar toggle did not close the code');
    expect((await toggle.getAttribute('aria-expanded')) === 'false', 'the toolbar toggle does not say it is closed');
    const preview = page.locator('section[aria-label="Preview"]');
    const code = preview.getByRole('button', { name: 'Code of the preview', exact: true });
    await code.click();
    await until(() => preview.getByRole('region', { name: 'Preview: code' }).isVisible(), 'the preview\'s code button did not open its code');
    await code.click();
    await until(async () => (await preview.getByRole('region', { name: 'Preview: code' }).count()) === 0, 'the preview\'s code button did not close its code');
    await page.close();
});

await behaviour('an example\'s ↗ opens it on its own page with the settings; a block\'s Phone switch narrows its frame', async () => {
    const page = await freshPage({ theme: 'dark', dir: 'rtl' });
    await page.goto(base + component, { waitUntil: 'networkidle' });
    const link = page.locator('section[aria-labelledby="example-custom-indicator"]').getByRole('link', { name: 'Open Custom indicator on its own page (opens in a new tab)' });
    await until(async () => /theme=dark.*dir=rtl/.test(await link.getAttribute('href')), 'the link does not carry the settings');
    expect((await link.getAttribute('target')) === '_blank', 'the link does not open a new tab');
    const own = await freshPage({});
    await own.goto(base + (await link.getAttribute('href')), { waitUntil: 'networkidle' });
    await until(async () => (await own.locator('#bui-example').getByRole('checkbox').count()) > 0, 'the example did not render on its own page');
    expect(await own.evaluate(() => document.documentElement.classList.contains('dark') && document.documentElement.dir === 'rtl'), 'its own page did not take the settings');
    await own.close();
    await page.goto(`${base}/blocks/dashboard`, { waitUntil: 'networkidle' });
    const frame = page.locator('section[aria-labelledby="preview"] iframe');
    const phone = page.getByRole('button', { name: 'Phone', exact: true });
    await phone.click();
    expect((await phone.getAttribute('aria-pressed')) === 'true', 'Phone does not report its selected state');
    await until(async () => (await frame.evaluate((element) => element.getBoundingClientRect().width)) <= 390, 'Phone did not narrow the block\'s frame');
    await until(() => page.frameLocator('section[aria-labelledby="preview"] iframe').getByRole('heading', { level: 1, name: 'Overview' }).isVisible(), 'the block did not render in its frame', 10000);
    await page.close();
});

await behaviour('settings: the WordPress frame, RTL and the pseudo-locale reach the examples; ☾ turns the site dark', async () => {
    const page = await freshPage({});
    await page.goto(base + component, { waitUntil: 'networkidle' });
    const open = async () => page.getByRole('button', { name: 'Example settings' }).click();
    await open();
    await page.getByRole('group', { name: 'Frame' }).getByRole('button', { name: 'WordPress admin' }).click();
    await page.keyboard.press('Escape');
    const frame = page.frameLocator('section[aria-label="Preview"] iframe');
    await frame.locator('#wpadminbar').waitFor();
    await until(() => frame.getByRole('checkbox', { name: 'Accept the terms' }).isVisible(), 'the framed example did not render', 10000);
    await open();
    await page.getByRole('group', { name: 'Frame' }).getByRole('button', { name: 'Plain' }).click();
    await page.getByRole('group', { name: 'Direction' }).getByRole('button', { name: 'RTL' }).click();
    await until(async () => (await page.getAttribute('html', 'dir')) === 'rtl', 'the page is not RTL');
    await page.getByRole('group', { name: 'Direction' }).getByRole('button', { name: 'LTR' }).click();
    await page.getByRole('group', { name: 'Strings' }).getByRole('button', { name: 'Pseudo-locale' }).click();
    await page.keyboard.press('Escape');
    await page.goto(`${base}/components/dialog`, { waitUntil: 'networkidle' });
    await page.locator('section[aria-label="Preview"]').getByRole('button', { name: 'Edit mailer' }).click();
    const close = page.getByRole('dialog').getByRole('button', { name: '[Ćĺóšé]' });
    await until(() => close.isVisible(), 'the close button is not named from the pseudo-locale');
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Switch to the dark theme' }).click();
    await until(() => page.evaluate(() => document.documentElement.classList.contains('dark')), '☾ did not turn the site dark');
    await page.close();
});

await behaviour('search: ⌘K opens it, typing finds a page, Enter opens it', async () => {
    const page = await freshPage({});
    await page.goto(base + component, { waitUntil: 'networkidle' });
    await page.keyboard.press('ControlOrMeta+k');
    const input = page.getByRole('combobox', { name: 'Search the documentation' });
    await input.fill('dialog');
    await until(async () => (await page.getByRole('option').first().textContent()).startsWith('Dialog'), 'Dialog is not the first result');
    await input.press('Enter');
    await page.waitForURL('**/components/dialog');
    await page.close();
});

await behaviour('at phone width: ☰ opens the list, Escape closes it and returns focus, nothing scrolls sideways', async () => {
    const page = await freshPage({}, { width: 390, height: 844 });
    await page.goto(base + component, { waitUntil: 'networkidle' });
    const menu = page.getByRole('button', { name: 'Open the component list' });
    await menu.click();
    await page.getByRole('dialog').getByRole('link', { name: 'Dialog', exact: true }).waitFor();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await until(() => menu.evaluate((el) => el === document.activeElement), 'focus did not return to ☰');
    expect(await page.getByRole('button', { name: 'On this page' }).isVisible(), 'no collapsible "On this page"');
    const sideways = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(sideways <= 0, `the page scrolls ${sideways} px sideways`);
    await page.close();
});

await behaviour('the pseudo-locale reaches Pagination: its links read in brackets', async () => {
    const page = await freshPage({ strings: 'pseudo' });
    await page.goto(`${base}/components/pagination`, { waitUntil: 'networkidle' });
    const block = page.locator('section[aria-label="Preview"]');
    await until(() => block.getByText('[Þŕéṽíóúš]').isVisible(), 'no [Þŕéṽíóúš]');
    await until(() => block.getByText('[Ńéẋť]').isVisible(), 'no [Ńéẋť]');
    await page.close();
});

await behaviour('the sidebar stays collapsed across a reload, in local storage and with no cookie', async () => {
    const page = await freshPage({});
    await page.goto(`${base}/components/sidebar`, { waitUntil: 'networkidle' });
    const frame = () => page.frameLocator('section[aria-label="Preview"] iframe');
    const state = () => frame().locator('[data-slot="sidebar"]').first().getAttribute('data-state');
    await until(async () => (await state()) === 'expanded', 'the sidebar does not start expanded', 10000);
    await frame().locator('[data-slot="sidebar-trigger"]').click();
    await until(async () => (await state()) === 'collapsed', 'the trigger did not collapse it');
    await page.reload({ waitUntil: 'networkidle' });
    await until(async () => (await state()) === 'collapsed', 'the reload expanded it again', 10000);
    const cookies = await page.context().cookies();
    expect(!cookies.some((c) => c.name === 'sidebar_state'), 'a sidebar_state cookie was set');
    expect((await page.evaluate(() => localStorage.getItem('bui-docs:sidebar'))) === 'false', 'local storage does not hold bui-docs:sidebar = false');
    await frame().locator('[data-slot="sidebar-trigger"]').click();
    await page.close();
});

await behaviour('Chart and Calendar install their extra package with the library under Installation', async () => {
    const page = await freshPage({});
    for (const [slug, peer] of [['chart', 'recharts'], ['calendar', 'react-day-picker']]) {
        await page.goto(`${base}/components/${slug}`, { waitUntil: 'networkidle' });
        const section = page.locator('section[aria-labelledby="installation"]');
        expect((await section.locator('pre').textContent()).includes(`npm install @booleanpress/ui ${peer}`), `the ${slug} page does not say "npm install @booleanpress/ui ${peer}"`);
        await section.getByRole('button', { name: 'pnpm' }).click();
        await until(async () => (await section.locator('pre').textContent()).includes(`pnpm add @booleanpress/ui ${peer}`), `pnpm does not switch the ${slug} command`);
    }
    await page.close();
});

await behaviour('a calendar\'s chosen day, both ends of a range and today keep their number in the middle of the circle', async () => {
    const page = await freshPage({});
    for (const example of ['calendar/single', 'calendar/range']) {
        await page.goto(`${base}/examples/${example}`, { waitUntil: 'networkidle' });
        await page.locator('[data-example-loading]').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
        const days = await page.evaluate(() =>
            [...document.querySelectorAll('[data-slot="calendar"] button[data-day]')].map((button) => {
                const number = document.createRange();
                number.selectNodeContents([...button.childNodes].find((node) => node.nodeType === Node.TEXT_NODE));
                const text = number.getBoundingClientRect();
                const circle = button.getBoundingClientRect();
                return { name: button.getAttribute('aria-label'), off: text.left + text.width / 2 - (circle.left + circle.width / 2) };
            })
        );
        expect(days.length > 28, `${example}: ${days.length} days found`);
        for (const { name, off } of days) expect(Math.abs(off) < 0.5, `${example}: "${name}" sits ${off.toFixed(1)} px off the middle of its circle`);
    }
    await page.close();
});

await behaviour('search: "date picker" finds Date picker first, and Enter opens it', async () => {
    const page = await freshPage({});
    await page.goto(base + component, { waitUntil: 'networkidle' });
    await page.keyboard.press('ControlOrMeta+k');
    const input = page.getByRole('combobox', { name: 'Search the documentation' });
    await input.fill('date picker');
    await until(async () => (await page.getByRole('option').first().textContent()).startsWith('Date picker'), 'Date picker is not the first result');
    await input.press('Enter');
    await page.waitForURL('**/components/date-picker');
    await page.close();
});

await behaviour('a pre-rendered example stays on the page while the site wakes up: no loading spinner replaces it', async () => {
    // A connection 150 ms from the server, so code that arrives late has the time to show.
    for (const path of [component, '/examples/alert-dialog/basic?theme=dark']) {
        const page = await freshPage({ theme: 'dark' });
        const cdp = await page.context().newCDPSession(page);
        await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.25e6, uploadThroughput: 1e6 });
        await page.addInitScript(() => {
            window.__buiSpinners = 0;
            const spinner = (node) => node.nodeType === 1 && (node.matches('[role=status][aria-label]') || node.querySelector('[role=status][aria-label]'));
            document.addEventListener('DOMContentLoaded', () =>
                new MutationObserver((records) => records.forEach((r) => r.addedNodes.forEach((n) => spinner(n) && (window.__buiSpinners += 1)))).observe(document, { childList: true, subtree: true }),
            );
        });
        await page.goto(base + path, { waitUntil: 'networkidle' });
        const shown = await page.evaluate(() => window.__buiSpinners);
        expect(shown === 0, `${path}: ${shown} examples were swapped for a loading spinner after the page arrived`);
        await cdp.detach();
        await page.close();
    }
});

await behaviour('search engines: each page names its address, and the sitemap lists the pages but not the examples', async () => {
    const page = await freshPage({});
    await page.goto(`${base}/components/dialog`, { waitUntil: 'networkidle' });
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical === 'https://ui.booleanpress.com/components/dialog', `the canonical address is ${canonical}`);
    const sitemap = await (await page.request.get(`${base}/sitemap.xml`)).text();
    expect(sitemap.includes('<loc>https://ui.booleanpress.com/components/dialog</loc>'), 'the sitemap misses the Dialog page');
    expect(sitemap.includes('<loc>https://ui.booleanpress.com/docs/theming</loc>'), 'the sitemap misses the Theming guide');
    expect(!sitemap.includes('/examples/'), 'the sitemap lists an example page');
    const robots = await (await page.request.get(`${base}/robots.txt`)).text();
    expect(robots.includes('Sitemap: https://ui.booleanpress.com/sitemap.xml'), 'robots.txt does not name the sitemap');
    await page.close();
});

await behaviour('on a touch screen every field shows 16 px text, so Safari does not zoom, and a single-line field keeps its height', async () => {
    const measure = () =>
        [...document.querySelectorAll('#bui-example :is(input:not([type="hidden"]), select, textarea, [role="spinbutton"]):not([aria-hidden="true"])')]
            .filter((field) => field.getBoundingClientRect().height > 0)
            .map((field) => ({
                name: field.getAttribute('data-slot'),
                text: parseFloat(getComputedStyle(field).fontSize),
                height: field.getBoundingClientRect().height,
                multiline: field.tagName === 'TEXTAREA',
            }));
    const open = async (page, example) => {
        await page.goto(`${base}/examples/${example}`, { waitUntil: 'networkidle' });
        await page.locator('[data-example-loading]').waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});
        return page.evaluate(measure);
    };
    const touch = await browser.newContext({ viewport: { width: 1440, height: 1000 }, hasTouch: true });
    try {
        for (const example of ['input/sizes', 'textarea/sizes', 'date-field/sizes', 'native-select/sizes', 'command/basic', 'pagination/jump-to-page']) {
            const mouse = await freshPage({});
            const before = await open(mouse, example);
            await mouse.close();
            const page = await touch.newPage();
            const after = await open(page, example);
            await page.close();
            expect(after.length > 0 && after.length === before.length, `${example}: ${after.length} fields on a touch screen, ${before.length} with a mouse`);
            after.forEach((field, i) => {
                expect(field.text >= 16, `${example}: ${field.name} has ${field.text} px text on a touch screen`);
                expect(field.multiline || Math.abs(field.height - before[i].height) < 0.5, `${example}: ${field.name} is ${field.height} px tall on a touch screen, ${before[i].height} px with a mouse`);
            });
        }
    } finally {
        await touch.close();
    }
});

await behaviour('an unknown address shows the "not found" page', async () => {
    const page = await freshPage({});
    await page.goto(`${base}/components/no-such-component`, { waitUntil: 'networkidle' });
    await until(() => page.getByRole('heading', { level: 1, name: 'Page not found' }).isVisible(), 'no "Page not found"');
    await page.close();
});

await browser.close();

if (failures.length) {
    console.error(failures.map((f) => `  FAIL ${f}`).join('\n'));
    console.error(`[docs-test] FAIL ${failures.length} problems · ${axeViolations} axe violations`);
    process.exit(1);
}
console.log(`[docs-test] ${pageCount} pages · ${axeViolations} unexpected axe violations · ${documentedContrastFindings} documented contrast findings · ${behaviours} behaviours passed`);
