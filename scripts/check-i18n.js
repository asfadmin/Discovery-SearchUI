/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function normalizeKey(key) {
  return key
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .replace(/_+/g, '_')
    .trim();
}

function main() {
  const root = process.cwd();
  const enPath = path.join(root, 'src', 'assets', 'i18n', 'en.json');
  const esPath = path.join(root, 'src', 'assets', 'i18n', 'es.json');

  const en = readJson(enPath);
  const es = readJson(esPath);

  const enKeys = Object.keys(en);
  const esKeys = Object.keys(es);

  const missingInEs = enKeys.filter((k) => !(k in es)).sort();
  const missingInEn = esKeys.filter((k) => !(k in en)).sort();

  const keysWithSpaces = enKeys
    .concat(esKeys)
    .filter((k) => /\s/.test(k))
    .sort();

  const normalizedGroups = new Map();
  for (const key of new Set([...enKeys, ...esKeys])) {
    const norm = normalizeKey(key);
    if (!normalizedGroups.has(norm)) normalizedGroups.set(norm, []);
    normalizedGroups.get(norm).push(key);
  }
  const possibleDuplicates = [...normalizedGroups.entries()]
    .filter(([_, keys]) => keys.length > 1)
    .map(([norm, keys]) => ({ norm, keys: keys.sort() }))
    .sort((a, b) => a.norm.localeCompare(b.norm));

  console.log('i18n check (en vs es)');
  console.log(`Missing in es: ${missingInEs.length}`);
  if (missingInEs.length) {
    console.log(missingInEs.join('\n'));
  }
  console.log(`\nMissing in en: ${missingInEn.length}`);
  if (missingInEn.length) {
    console.log(missingInEn.join('\n'));
  }

  console.log(`\nKeys with spaces: ${keysWithSpaces.length}`);
  if (keysWithSpaces.length) {
    console.log(keysWithSpaces.join('\n'));
  }

  console.log(`\nPossible duplicate keys (same normalized form): ${possibleDuplicates.length}`);
  for (const group of possibleDuplicates) {
    console.log(`${group.norm}: ${group.keys.join(', ')}`);
  }
}

main();
