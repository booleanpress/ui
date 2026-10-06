// Stage the exact tarball produced and tested by pnpm check. Human approval with 2FA publishes it.
// --preflight is read-only and lets CI skip existing versions before installing dependencies.
// --dry-run runs the full check and verifies the artifact without staging anything.
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { releaseNpm } from './release-npm.mjs';

const root = resolve(import.meta.dirname, '..');

function publishedVersions(name) {
    try {
        const out = execFileSync('npm', ['view', name, 'versions', '--json', '--registry=https://registry.npmjs.org', '--fetch-retries=0', '--fetch-timeout=15000'], {
            cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
        });
        const value = JSON.parse(out);
        const versions = Array.isArray(value) ? value : [value];
        if (!versions.length || !versions.every((version) => typeof version === 'string')) {
            throw new Error('Unexpected versions response from npm.');
        }
        return versions;
    } catch (error) {
        // Only npm's structured E404 means absent. Network/auth errors must fail, never bootstrap a package.
        let code;
        try { code = JSON.parse(String(error.stdout)).error?.code; } catch { /* not an npm JSON response */ }
        if (code === 'E404') return [];
        throw error;
    }
}

export function main(args = process.argv.slice(2)) {
    if (args.some((arg) => !['--preflight', '--dry-run'].includes(arg))) throw new Error('Usage: publish-package.mjs [--preflight | --dry-run]');
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    const id = `${pkg.name}@${pkg.version}`;
    const inCi = process.env.GITHUB_ACTIONS === 'true';
    if (pkg.private) throw new Error(`${id} is private; nothing was staged.`);
    const versions = publishedVersions(pkg.name);
    let skip;
    if (versions.includes(pkg.version)) skip = 'npm already has it';
    else if (inCi && versions.length === 0) skip = 'first create the package with pnpm release:first and configure its trusted publisher';
    else if (!inCi && versions.length > 0) throw new Error(`${pkg.name} already exists; later versions are staged by the release workflow.`);

    if (args.includes('--preflight')) {
        if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `stage=${!skip}\n`);
        console.log(`[release] ${skip ? 'skip' : 'ready'} ${id}${skip ? `: ${skip}` : ''}`);
        return;
    }
    if (skip) {
        console.log(`[release] skip ${id}: ${skip}`);
        return;
    }

    console.log('[release] pnpm check');
    execFileSync('pnpm', ['check'], { cwd: root, stdio: 'inherit' });
    const tarball = join(root, `${pkg.name.replace(/^@/, '').replace('/', '-')}-${pkg.version}.tgz`);
    const packed = JSON.parse(execFileSync('tar', ['-xOf', tarball, 'package/package.json'], { encoding: 'utf8' }));
    if (packed.name !== pkg.name || packed.version !== pkg.version || packed.private) {
        throw new Error(`Checked tarball does not match public ${id}; nothing was staged.`);
    }
    if (args.includes('--dry-run')) {
        console.log(`[release] dry run: checked ${tarball}; nothing was staged`);
        return;
    }
    releaseNpm(['stage', 'publish', tarball, '--access', 'public', '--ignore-scripts'], { cwd: root });
    console.log(`[release] ${id} staged. Review with pnpm release:approve; approval requires 2FA.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try { main(); } catch (error) {
        console.error(`[release] ${error.message}`);
        process.exitCode = 1;
    }
}
