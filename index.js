#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { exec } = require('child_process');

if (!process.argv[2]) {
  console.error('usage: whaatch <filename>');
  process.exit();
}

const dir = path.resolve(process.argv[2]);

// check for git repo in dir
if (!fs.existsSync(path.resolve(dir, '.git'))) {
  console.error('no git repo in ' + dir);
  process.exit();
}

function commit(eventType, filename) {
  if (
    // ignore some dirs that cause infinite loops
    !filename.startsWith('.git') &&
    !filename.startsWith('node_modules') &&
    !filename.startsWith('.DS_Store')
  ) {
    // check if git detects file change, add all files, and commit with message
    const cmd = `cd ${dir} && [ -n "$(git status --porcelain)" ] && git add --all && git commit -a -m "${eventType} ${filename}"`;

    exec(cmd, (err, stdout, stderr) => {
      // if (err) console.log(err);
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
    });
  }
}

chokidar
  .watch(dir, {
    awaitWriteFinish: true,
    ignoreInitial: true,
    cwd: '.',
  })
  .on('add', (path) => commit('add', path))
  .on('change', (path) => commit('change', path));
