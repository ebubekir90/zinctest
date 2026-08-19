/**
 * Reusable "add + commit + push" helper for any git project.
 *
 * Usage:
 *   npm run push                 # commit with an automatic timestamped message
 *   npm run push -- "my message" # commit with a custom message
 *
 * Add this npm script to package.json, copy this file to scripts/push.js,
 * and you're done. Works in CMD, PowerShell and Git Bash.
 */
const { execSync } = require('node:child_process');

const args = process.argv.slice(2);
const message = args.join(' ') || `chore: update ${new Date().toISOString()}`;

function run(command) {
  try {
    execSync(command, { stdio: 'inherit', shell: true });
  } catch {
    /* ignore: e.g. "nothing to commit" - the push below still runs */
  }
}

console.log('> git add -A');
run('git add -A');

console.log(`> git commit -m "${message}"`);
run(`git commit -m ${JSON.stringify(message)}`);

console.log('> git push');
run('git push');

console.log('\nDone ✔');
