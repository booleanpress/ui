import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());

if (typeof window !== 'undefined') {
    // jsdom lacks the layout and pointer APIs Radix calls; these stubs let the primitives run.
    const proto = window.HTMLElement.prototype;
    proto.scrollIntoView ||= function scrollIntoView() {};
    proto.hasPointerCapture ||= () => false;
    proto.setPointerCapture ||= () => {};
    proto.releasePointerCapture ||= () => {};
    globalThis.ResizeObserver ||= class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
    // Width queries answer from window.innerWidth, which a test may set; any other query does not match.
    const widthMatches = (query) => {
        const max = query.match(/max-width:\s*(\d+)px/);
        const min = query.match(/min-width:\s*(\d+)px/);
        if (!max && !min) return false;
        return (!max || window.innerWidth <= Number(max[1])) && (!min || window.innerWidth >= Number(min[1]));
    };
    window.matchMedia ||= (query) => ({
        get matches() {
            return widthMatches(query);
        },
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent: () => false,
    });
}
