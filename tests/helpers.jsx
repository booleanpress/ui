import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { expect } from 'vitest';
import { BooleanUIProvider } from '@booleanpress/ui/provider';

/** Renders inside the provider, as every product does; returns Testing Library's result plus a user-event instance. */
export function renderUi(ui, providerProps = {}) {
    const user = userEvent.setup();
    const result = render(<BooleanUIProvider {...providerProps}>{ui}</BooleanUIProvider>);
    return { user, ...result };
}

/**
 * Runs axe on the whole document (portalled overlays included) and fails on any violation. Colour contrast is
 * checked by bui-contrast and in the browser: jsdom has no layout or computed colours.
 */
export async function expectNoAxeViolations(context = document.body) {
    const results = await axe.run(context, {
        rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    const found = results.violations.map((v) => `${v.impact} ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
    globalThis.__buiAxeRuns = (globalThis.__buiAxeRuns ?? 0) + 1;
    expect(found).toEqual([]);
}
