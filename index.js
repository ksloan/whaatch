#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

if (!process.argv[2]) {
  console.error('usage: whaatch <filename>')
  process.exit()
}

const dir = path.resolve(process.argv[2])

// check for git repo in dir
if (!fs.existsSync(path.resolve(dir, '.git'))) {
  console.error('no git repo in ' + dir)
  process.exit()
}

fs.watch(dir, { recursive: true }, (eventType, filename) => {
  // ignore hidden files
  if (filename.charAt(0) !== '.') {
    const cmd = `cd ${dir} && git add --all && git commit -a -m "${eventType} ${filename}" && git log -1`

    exec(cmd, (err, stdout, stderr) => {
      if (err) console.log(err)
      if (stdout) console.log(stdout)
      if (stderr) console.log(stderr)
    })
  }
})
