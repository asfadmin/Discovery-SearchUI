#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');
const { Project, SyntaxKind } = require('ts-morph');

const tsconfig = 'tsconfig.json';
const htmlGlob = 'src/**/*.html';
const translationFile = 'src/assets/i18n/en.json';

// ── TypeScript — AST via ts-morph ────────────────────────────────────────────
const project = new Project({ tsConfigFilePath: path.resolve(tsconfig) });

const tsKeys = new Map(); // key → [file, ...]

for (const sourceFile of project.getSourceFiles()) {
  if (sourceFile.getFilePath().includes('node_modules')) continue;

  const relPath = path.relative(process.cwd(), sourceFile.getFilePath());

  sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((call) => {
    const expr = call.getExpression();
    if (expr.getKind() !== SyntaxKind.PropertyAccessExpression) return;
    if (expr.getName() !== 'instant') return;

    const first = call.getArguments()[0];
    if (!first) return;

    if (
      first.getKind() === SyntaxKind.StringLiteral ||
      first.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral
    ) {
      const key = first.getLiteralValue();
      tsKeys.set(key, [...(tsKeys.get(key) ?? []), relPath]);
    }
  });
}

// ── HTML — translate pipe ─────────────────────────────────────────────────────
const HTML_PATTERN =
  /['"`]([A-Z0-9_]+(?:\.[A-Z0-9_]+)*)['"`]\s*\|\s*translate/g;

const htmlKeys = new Map(); // key → [file, ...]

for (const file of globSync(htmlGlob, {
  ignore: ['node_modules/**', 'dist/**'],
})) {
  const src = fs.readFileSync(file, 'utf8');
  let m;
  HTML_PATTERN.lastIndex = 0;
  while ((m = HTML_PATTERN.exec(src)) !== null) {
    const key = m[1];
    htmlKeys.set(key, [...(htmlKeys.get(key) ?? []), file]);
  }
}

// ── Load translation file ─────────────────────────────────────────────────────
const definedKeys = new Set(
  Object.keys(
    JSON.parse(fs.readFileSync(path.resolve(translationFile), 'utf8')),
  ),
);

// ── Check ─────────────────────────────────────────────────────────────────────
const KEY_PATTERN = /^[A-Z][A-Z0-9_]*$/;

const allKeys = new Map([...tsKeys, ...htmlKeys]);
const missing = [];

for (const [key, _] of [...allKeys.entries()].sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  if (!KEY_PATTERN.test(key)) continue;
  const merged = [
    ...new Set([...(tsKeys.get(key) ?? []), ...(htmlKeys.get(key) ?? [])]),
  ];
  if (!definedKeys.has(key)) {
    missing.push({ key, files: merged });
  }
}

if (missing.length === 0) {
  console.log(`✅  All ${allKeys.size} keys found in ${translationFile}`);
} else {
  console.log(`❌  ${missing.length} missing keys:\n`);
  for (const { key, files } of missing) {
    console.log(`  ${key}`);
    for (const f of files) console.log(`    ${f}`);
  }
  process.exit(1);
}
