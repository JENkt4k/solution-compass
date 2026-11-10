import fs from 'node:fs';
import assert from 'node:assert/strict';
import { pinnedUrl, validateCatalog } from './merit-catalog.mjs';
const data = JSON.parse(fs.readFileSync(new URL('../src/data/merit-concurrency.json',import.meta.url)));
validateCatalog(data);
for (const mutate of [d => d.cases.push(d.cases[0]), d => d.cases[0].status='passing', d => d.cases[0].evidence=['javascript:alert(1)'], d => d.cases[0].contract='', d => d.cases[0].injected='x', d => d.cases[0].status='verified']) {
  const d = structuredClone(data); mutate(d); assert.throws(()=>validateCatalog(d));
}
for (const url of ['http://localhost/x','https://raw.githubusercontent.com/a/b/main/x','https://github.com/a/b/blob/main/x','https://github.com.evil.test/a/b/blob/'+'a'.repeat(40)+'/x']) assert.throws(()=>pinnedUrl(url));
assert.equal(pinnedUrl('https://github.com/a/b/blob/'+'a'.repeat(40)+'/x.json'),'https://raw.githubusercontent.com/a/b/'+'a'.repeat(40)+'/x.json');
console.log(`Validated ${data.cases.length} Merit specifications and import rejection cases.`);
