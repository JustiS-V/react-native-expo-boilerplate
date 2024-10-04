const fs = require('fs');
const path = require('path');

const commitMsgFile = process.argv[2] || path.join('.git', 'COMMIT_EDITMSG');
if (!fs.existsSync(commitMsgFile)) {
  console.error('Error: Commit message file not found.');
  process.exit(1);
}

const commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim();

// Semantic commit message validation pattern
const commitPattern = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9\-]+\))?: .+/;

if (!commitPattern.test(commitMsg)) {
  console.error('\x1b[31mError: Invalid commit message format.\x1b[0m');
  console.error('Commit messages must follow Conventional Commits guidelines, e.g.:');
  console.error('  \x1b[32mfeat(auth): add user login authentication\x1b[0m');
  console.error('  \x1b[32mfix: resolve memory leak on unmount\x1b[0m\n');
  console.error('Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert');
  process.exit(1);
}
