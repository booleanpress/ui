// Staging starts in npm 11.15.0. Pin the CLI used for staging and human approval.
import { execFileSync } from 'node:child_process';

export function releaseNpm(args, options = {}) {
    const [major, minor] = process.versions.node.split('.').map(Number);
    if (major < 22 || (major === 22 && minor < 14)) {
        throw new Error(`Staged publishing needs Node 22.14.0 or later; this is ${process.version}.`);
    }
    // pnpm injects its own npm_config_* options, which are not npm CLI settings.
    const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.toLowerCase().startsWith('npm_config_')));
    return execFileSync('npx', ['--yes', 'npm@11.15.0', ...args], { env, stdio: 'inherit', ...options });
}
