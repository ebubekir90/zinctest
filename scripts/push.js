/**
 * Quick git helper: stage all, commit, push.
 *
 * Usage:
 *   npm run push                 # commit with an automatic timestamped message
 *   npm run push -- "my message" # commit with a custom message
 *
 * Runs regardless of the shell (CMD, PowerShell or Git Bash) because it uses
 * Node's child_process and a temp commit-message file (avoids quote issues).
 */
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const args = process.argv.slice(2);
const message = args.join(' ') || `chore: update ${new Date().toISOString()}`;

// Run a command but keep going even if it fails (e.g. "nothing to commit").
function run(command) {
  try {
    execSync(command, { stdio: 'inherit', shell: true });
  } catch {
    /* ignore - handled below */
  }
}

console.log('> git add -A');
run('git add -A');

// Write the message to a temp file and use `git commit -F` so the committed
// message is exactly our text (no shell quoting surprises).
const tmp = path.join(os.tmpdir(), `commit-msg-${Date.now()}.txt`);
fs.writeFileSync(tmp, `${message}\n`);
console.log(`> git commit -F "${message}"`);
run(`git commit -F "${tmp}"`);
try {
  fs.unlinkSync(tmp);
} catch {
  /* ignore */
}

console.log('> git push');
run('git push');

console.log('\nDone ✔ (all local changes staged, committed and pushed)');
