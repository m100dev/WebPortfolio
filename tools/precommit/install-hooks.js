#!/usr/bin/env node
// npm "prepare" script: points git at .githooks/ so the pre-commit and pre-push hooks run.
// It also runs inside Amplify's `npm ci`, so it must never fail the build: with no .git folder
// or no git binary it logs why and exits 0.

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

function install({ root, exists = fs.existsSync, git = (args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' }) }) {
  if (!exists(path.join(root, '.git'))) return { installed: false, reason: 'no .git here (e.g. a packaged or CI copy)' }
  const res = git(['config', 'core.hooksPath', '.githooks'])
  if (res.error || res.status !== 0) return { installed: false, reason: `git config failed: ${res.error ? res.error.message : res.stderr}` }
  return { installed: true }
}

if (require.main === module) {
  try {
    const r = install({ root: path.resolve(__dirname, '..', '..') })
    console.log(r.installed ? 'git hooks: core.hooksPath set to .githooks' : `git hooks: skipped, ${r.reason}`)
  } catch (err) {
    console.log(`git hooks: skipped, ${err.message}`)
  }
  process.exitCode = 0
}

module.exports = { install }
