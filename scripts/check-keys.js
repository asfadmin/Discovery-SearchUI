#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');
const { Project, SyntaxKind } = require('ts-morph');

const CONFIG = {
  tsconfig: 'tsconfig.json',
  htmlGlob: 'src/**/*.html',
  translationGlob: 'src/assets/i18n/*.json',
};

function extractKeysFromTS(project) {
  const keys = new Map();

  for (const sourceFile of project.getSourceFiles()) {
    if (sourceFile.getFilePath().includes('node_modules')) continue;

    const relPath = path.relative(process.cwd(), sourceFile.getFilePath());

    sourceFile
      .getDescendantsOfKind(SyntaxKind.CallExpression)
      .forEach((call) => {
        const expr = call.getExpression();
        if (expr.getKind() !== SyntaxKind.PropertyAccessExpression) return;
        if (expr.getName() !== 'instant') return;

        const firstArg = call.getArguments()[0];
        if (!firstArg) return;

        if (
          firstArg.getKind() === SyntaxKind.StringLiteral ||
          firstArg.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral
        ) {
          const key = firstArg.getLiteralValue();
          addKeyToMap(keys, key, relPath);
        }
      });
  }
  return keys;
}

function extractKeysFromHTML(pattern, globPath) {
  const keys = new Map();
  const files = globSync(globPath);

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    let match;
    const regex = new RegExp(pattern);

    while ((match = regex.exec(src)) !== null) {
      addKeyToMap(keys, match[1], file);
    }
  }
  return keys;
}

function loadDefinedKeys(folderGlob) {
  const translationFiles = globSync(folderGlob);

  if (translationFiles.length === 0) {
    console.error(`❌ No translation files found for glob: ${folderGlob}`);
    process.exit(1);
  }

  const keySets = translationFiles.map((filePath) => {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return [path.basename(filePath), new Set(Object.keys(content))];
  });

  keySets.sort(([, setA], [, setB]) => setB.size - setA.size);
  const [[_, firstKeySet], ...rest] = keySets;

  rest.forEach(([filePath, keySet]) => {
    const missing = firstKeySet.difference(keySet);
    if (missing.size > 0) {
      console.log(`❌ ${filePath} is missing ${missing.size} keys:`);
      console.log(`   ${[...missing].join(', ')}`);
      process.exit(1);
    }
  });

  return firstKeySet;
}

function addKeyToMap(map, key, file) {
  const existing = map.get(key) || [];
  if (!existing.includes(file)) {
    map.set(key, [...existing, file]);
  }
}

function main() {
  const project = new Project({
    tsConfigFilePath: path.resolve(CONFIG.tsconfig),
  });
  const html_pattern =
    /['"`]([A-Z0-9_]+(?:\.[A-Z0-9_]+)*)['"`]\s*\|\s*translate/g;

  const tsKeys = extractKeysFromTS(project);
  const htmlKeys = extractKeysFromHTML(html_pattern, CONFIG.htmlGlob);
  const definedKeys = loadDefinedKeys(CONFIG.translationGlob);

  const combinedKeys = new Set([...tsKeys.keys(), ...htmlKeys.keys()]);
  const sortedKeys = Array.from(combinedKeys).sort((a, b) =>
    a.localeCompare(b),
  );

  const keyPattern = /^[A-Z][A-Z0-9_]*$/;

  const missing = [];
  for (const key of sortedKeys) {
    if (!keyPattern.test(key)) continue;

    if (!definedKeys.has(key)) {
      const occurrences = new Set([
        ...(tsKeys.get(key) || []),
        ...(htmlKeys.get(key) || []),
      ]);
      missing.push({ key, files: Array.from(occurrences) });
    }
  }

  const totalCount = definedKeys.size;

  if (missing.length === 0) {
    console.log(`✅ All ${totalCount} keys found in ${CONFIG.translationGlob}`);
  } else {
    console.log(
      `❌ ${missing.length} missing keys out of ${totalCount} total:\n`,
    );
    for (const { key, files } of missing) {
      console.log(`  ${key}`);
      for (const f of files) console.log(`    └─ ${f}`);
    }
    process.exit(1);
  }
}

main();
