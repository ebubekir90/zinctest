/**
 * Quick git helper: stage all, commit, push.
 *
 * Usage:
 *   npm run push                 # commit with an automatic timestamped message
 *   npm run push -- "my message" # commit with a custom message
 *
 * Runs regardless of the shell (CMD, PowerShell or Git Bash) because it uses
 * Node's child_process instead of relying on shell-specific syntax.
 */
const { execSync } = require('node:child_process');

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

console.log(`> git commit -m "${message}"`);
run(`git commit -m ${JSON.stringify(message)}`);

console.log('> git push');
run('git push');

console.log('\nDone ✔ (all local changes staged, committed and pushed)');
