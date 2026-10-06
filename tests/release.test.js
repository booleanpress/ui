// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { main } from '../scripts/publish-package.mjs';
import { releaseNpm } from '../scripts/release-npm.mjs';

vi.mock('node:child_process', () => ({ execFileSync: vi.fn() }));
vi.mock('../scripts/release-npm.mjs', () => ({ releaseNpm: vi.fn() }));
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

function registryError(code) {
    return Object.assign(new Error(`npm ${code}`), { stdout: JSON.stringify({ error: { code } }) });
}
function commands({ versions = ['0.0.0-stage'], error, packed = pkg, checkError } = {}) {
    execFileSync.mockImplementation((command) => {
        if (command === 'npm') {
            if (error) throw error;
            return JSON.stringify(versions);
        }
        if (command === 'pnpm') {
            if (checkError) throw checkError;
            return '';
        }
        if (command === 'tar') return JSON.stringify(packed);
        throw new Error(`Unexpected command: ${command}`);
    });
}
beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('GITHUB_ACTIONS', 'true');
    vi.stubEnv('GITHUB_OUTPUT', '');
});

describe('release guardrails', () => {
    it('preflights an unpublished version without installing, checking or staging', () => {
        commands();
        main(['--preflight']);
        expect(execFileSync).toHaveBeenCalledTimes(1);
        expect(releaseNpm).not.toHaveBeenCalled();
    });
    it('skips a version already published', () => {
        commands({ versions: [pkg.version] });
        main([]);
        expect(execFileSync).toHaveBeenCalledTimes(1);
        expect(releaseNpm).not.toHaveBeenCalled();
    });
    it('skips first publication in CI only on structured E404', () => {
        commands({ error: registryError('E404') });
        main([]);
        expect(execFileSync).toHaveBeenCalledTimes(1);
        expect(releaseNpm).not.toHaveBeenCalled();
    });
    it.each(['ENOTFOUND', 'E401', 'E500'])('fails on %s instead of treating it as an absent package', (code) => {
        commands({ error: registryError(code) });
        expect(() => main(['--preflight'])).toThrow(code);
        expect(releaseNpm).not.toHaveBeenCalled();
    });
    it('rejects misleading E404 text without a structured npm error', () => {
        commands({ error: new Error('proxy returned E404') });
        expect(() => main([])).toThrow('proxy returned E404');
        expect(releaseNpm).not.toHaveBeenCalled();
    });
    it('rejects malformed registry responses', () => {
        commands({ versions: { error: 'unavailable' } });
        expect(() => main([])).toThrow('Unexpected versions response');
        expect(releaseNpm).not.toHaveBeenCalled();
    });
    it('never stages if the full check fails', () => {
        commands({ checkError: new Error('fixture failed') });
        expect(() => main([])).toThrow('fixture failed');
        expect(releaseNpm).not.toHaveBeenCalled();
    });
    it.each([{ ...pkg, version: '9.9.9' }, { ...pkg, name: '@other/ui' }, { ...pkg, private: true }])('rejects a mismatched or private tarball', (packed) => {
        commands({ packed });
        expect(() => main([])).toThrow('Checked tarball does not match');
        expect(releaseNpm).not.toHaveBeenCalled();
    });
    it('checks the exact tarball then stages it without repacking or lifecycle scripts', () => {
        commands();
        main([]);
        const tarball = execFileSync.mock.calls.find(([command]) => command === 'tar')[1][1];
        expect(execFileSync.mock.calls.map(([command]) => command)).toEqual(['npm', 'pnpm', 'tar']);
        expect(releaseNpm).toHaveBeenCalledWith(['stage', 'publish', tarball, '--access', 'public', '--ignore-scripts'], expect.any(Object));
    });
    it('performs first-publication dry run without invoking staging', () => {
        vi.stubEnv('GITHUB_ACTIONS', 'false');
        commands({ error: registryError('E404') });
        main(['--dry-run']);
        expect(execFileSync).toHaveBeenCalledWith('pnpm', ['check'], expect.any(Object));
        expect(releaseNpm).not.toHaveBeenCalled();
    });
    it('refuses local staging for an existing package', () => {
        vi.stubEnv('GITHUB_ACTIONS', 'false');
        commands();
        expect(() => main([])).toThrow('later versions are staged by the release workflow');
        expect(releaseNpm).not.toHaveBeenCalled();
    });
});
