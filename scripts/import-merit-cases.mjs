import fs from 'node:fs';
import { pinnedUrl, validateCatalog } from './merit-catalog.mjs';
// Fetch data only. Never evaluate imported code or follow redirects.
const url = pinnedUrl(process.argv[2]);
const response = await fetch(url, {redirect:'error', signal:AbortSignal.timeout(15000)});
if (!response.ok) throw Error(`Fetch failed: ${response.status}`);
const reader = response.body.getReader();
const chunks = []; let size = 0;
try {
  for (;;) {
    const {done,value} = await reader.read(); if (done) break;
    size += value.length;
    if (size > 1024 * 1024) throw Error('Import exceeds 1 MiB');
    chunks.push(Buffer.from(value));
  }
} finally { await reader.cancel(); }
const incoming = validateCatalog(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Buffer.concat(chunks))));
const path = new URL('../src/data/merit-concurrency.json', import.meta.url);
const current = validateCatalog(JSON.parse(fs.readFileSync(path,'utf8')));
const cases = new Map(current.cases.map(c => [c.id,c]));
for (const c of incoming.cases) cases.set(c.id,c);
const merged = validateCatalog({schemaVersion:1,cases:[...cases.values()]});
// Write only after the entire response and merged catalog validate. Review the git diff before committing.
fs.writeFileSync(new URL('../src/data/merit-concurrency.json.tmp',import.meta.url), JSON.stringify(merged,null,2)+'\n');
fs.renameSync(new URL('../src/data/merit-concurrency.json.tmp',import.meta.url),path);
console.log(`Imported ${incoming.cases.length} cases from ${url}; review git diff before publishing.`);
