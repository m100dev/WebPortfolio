#!/usr/bin/env node
// vuln-check: a small AST scanner for code that parses fine but is unsafe.
// Usage: node tools/vuln-check/vuln-check.js <file-or-folder> [...]
// Prints `file:line rule message` per finding and exits 1 if there are any.
//
// Suppress a reviewed, intentional case with a comment on the same line or the line above:
//   // vuln-check-ignore <rule>: <why it is safe>
// A suppression without a reason is ignored, so every exception stays explained.

const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default

const EXTENSIONS = new Set(['.js', '.jsx'])
const SKIP_DIRS = new Set(['node_modules', 'build', '.git', 'coverage'])

const SECRET_PATTERNS = [
  { re: /AKIA[0-9A-Z]{16}/, label: 'AWS access key ID' },
  { re: /-----BEGIN .*PRIVATE KEY-----/, label: 'private key' },
  { re: /sk-[A-Za-z0-9]{20,}/, label: 'API secret key (sk-...)' }
]

const IGNORE_RE = /vuln-check-ignore\s+([a-z-]+)\s*:\s*\S/

function collectFiles(paths) {
  const files = []
  const walk = (p) => {
    const stat = fs.statSync(p)
    if (stat.isDirectory()) {
      if (SKIP_DIRS.has(path.basename(p))) return
      for (const entry of fs.readdirSync(p).sort()) walk(path.join(p, entry))
    } else if (EXTENSIONS.has(path.extname(p))) {
      files.push(p)
    }
  }
  paths.forEach(walk)
  return files
}

// JSX attribute value as a plain string, or null when it's an expression we can't resolve statically
function attrString(attr) {
  if (!attr || !attr.value) return null
  const v = attr.value
  if (v.type === 'StringLiteral') return v.value
  if (v.type === 'JSXExpressionContainer') {
    const e = v.expression
    if (e.type === 'StringLiteral') return e.value
    if (e.type === 'TemplateLiteral' && e.expressions.length === 0) return e.quasis[0].value.cooked
  }
  return null
}

function findAttr(attrs, name) {
  return attrs.find((a) => a.type === 'JSXAttribute' && a.name && a.name.name === name)
}

function scanSource(code, file) {
  const findings = []
  let ast
  try {
    ast = parse(code, { sourceType: 'module', plugins: ['jsx'], errorRecovery: false })
  } catch (err) {
    const line = (err.loc && err.loc.line) || 1
    return [{ file, line, rule: 'syntax-error', message: err.message.replace(/\s*\(\d+:\d+\)$/, '') }]
  }

  const lines = code.split(/\r?\n/)
  const suppressed = (line, rule) =>
    [lines[line - 1], lines[line - 2]].some((l) => {
      const m = l && l.match(IGNORE_RE)
      return m && m[1] === rule
    })
  const report = (node, rule, message) => {
    const line = node.loc.start.line
    if (!suppressed(line, rule)) findings.push({ file, line, rule, message })
  }

  const checkSecret = (node, value) => {
    for (const { re, label } of SECRET_PATTERNS) {
      if (re.test(value)) return report(node, 'hardcoded-secret', `string looks like a ${label}`)
    }
  }

  traverse(ast, {
    StringLiteral(p) {
      checkSecret(p.node, p.node.value)
    },
    TemplateElement(p) {
      checkSecret(p.node, p.node.value.cooked || '')
    },
    CallExpression(p) {
      if (p.node.callee.type === 'Identifier' && p.node.callee.name === 'eval') {
        report(p.node, 'eval', 'eval() runs a string as code')
      }
    },
    NewExpression(p) {
      if (p.node.callee.type === 'Identifier' && p.node.callee.name === 'Function') {
        report(p.node, 'eval', 'new Function() runs a string as code')
      }
    },
    AssignmentExpression(p) {
      const left = p.node.left
      if (left.type !== 'MemberExpression') return
      const prop = left.computed ? left.property.value : left.property.name
      if (prop === 'innerHTML' || prop === 'outerHTML') {
        report(p.node, 'inner-html', `assigning to .${prop} renders HTML without escaping`)
      }
    },
    JSXOpeningElement(p) {
      const attrs = p.node.attributes

      const danger = findAttr(attrs, 'dangerouslySetInnerHTML')
      if (danger) {
        const e = danger.value && danger.value.expression
        const html =
          e && e.type === 'ObjectExpression'
            ? e.properties.find((pr) => pr.key && (pr.key.name === '__html' || pr.key.value === '__html'))
            : null
        if (!html || html.value.type !== 'StringLiteral') {
          report(danger, 'unsafe-html', 'dangerouslySetInnerHTML with a non-literal __html')
        }
      }

      for (const name of ['href', 'src']) {
        const value = attrString(findAttr(attrs, name))
        if (value && /^\s*javascript:/i.test(value)) {
          report(findAttr(attrs, name), 'javascript-url', `${name} uses a javascript: URL`)
        }
      }

      const target = findAttr(attrs, 'target')
      if (target && attrString(target) === '_blank') {
        const rel = attrString(findAttr(attrs, 'rel')) || ''
        if (!/\b(noreferrer|noopener)\b/.test(rel)) {
          report(target, 'blank-without-rel', 'target="_blank" without rel="noreferrer" or "noopener"')
        }
      }
    }
  })

  return findings
}

function scan(paths) {
  const findings = []
  for (const file of collectFiles(paths)) {
    findings.push(...scanSource(fs.readFileSync(file, 'utf8'), file))
  }
  return findings
}

module.exports = { scan, scanSource }

if (require.main === module) {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('usage: vuln-check <file-or-folder> [...]')
    process.exitCode = 2
  } else {
    const findings = scan(args)
    for (const f of findings) console.log(`${f.file}:${f.line} ${f.rule} ${f.message}`)
    console.log(findings.length ? `\n${findings.length} finding(s)` : 'vuln-check: no findings')
    if (findings.length) process.exitCode = 1
  }
}
