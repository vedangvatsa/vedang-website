/**
 * smm-boost-trigger.ts — Lightweight helper to spawn smm-boost in background
 *
 * Import and call triggerBoost() after a successful post.
 * Spawns the boost script as a detached child process so it doesn't
 * block the executor from committing and exiting.
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BOOST_SCRIPT = path.resolve(__dirname, 'smm-boost.ts');

export function triggerBoost(platform: string, postUrl: string, context?: string) {
  // Only trigger if SMM_BOOST_ENABLED is set (the boost script also checks this)
  if (!process.env.SMM_BOOST_ENABLED && process.env.SMM_BOOST_ENABLED !== 'true') {
    console.log(`📡 SMM boost skipped (SMM_BOOST_ENABLED not set)`);
    return;
  }

  const args = ['tsx', BOOST_SCRIPT, '--platform', platform, '--url', postUrl];
  if (context) {
    // Pass first 200 chars of post text as context for comment matching
    args.push('--context', context.substring(0, 200));
  }

  console.log(`📡 Triggering SMM boost for ${platform}: ${postUrl}`);

  try {
    const child = spawn('npx', args, {
      detached: true,
      stdio: 'ignore',
      env: { ...process.env },
      cwd: path.resolve(__dirname, '..'),
    });
    child.unref(); // Let the child run independently
    console.log(`📡 SMM boost spawned (PID: ${child.pid})`);
  } catch (err: any) {
    console.error(`⚠️ SMM boost spawn failed: ${err.message}`);
    // Non-fatal — don't let boost failure break the posting pipeline
  }
}
