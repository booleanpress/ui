// List pending versions, or approve one stage ID with the maintainer's npm login and 2FA.
//   pnpm release:approve
//   pnpm release:approve <stage-id>
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { releaseNpm } from './release-npm.mjs';

const root = resolve(import.meta.dirname, '..');
const { name } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const stageId = process.argv[2];

try {
    if (process.env.GITHUB_ACTIONS === 'true') throw new Error('Stage approval requires a maintainer session and 2FA; it cannot run in CI.');
    if (process.argv.length > 3 || stageId?.startsWith('-')) throw new Error('Usage: pnpm release:approve [stage-id]');
    // Let npm report expired credentials or network failures; never turn those into an automatic login flow.
    releaseNpm(stageId ? ['stage', 'approve', stageId] : ['stage', 'list', name], { cwd: root });
    if (!stageId) console.log('\nReview: npx --yes npm@11.15.0 stage view <stage-id>\nApprove with 2FA: pnpm release:approve <stage-id>');
} catch (error) {
    console.error(`[release] ${error.message}`);
    process.exitCode = 1;
}
