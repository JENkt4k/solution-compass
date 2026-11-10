export const fields = ['id','title','category','status','documentation','contract','hardened','metrics','execution','consistency','ownership','verification','inputPolicy','evidence'];
export function pinnedUrl(value) {
  const u = new URL(value);
  if (u.protocol !== 'https:' || u.username || u.password || u.port || u.search || u.hash) throw Error('Expected a clean HTTPS URL');
  if (!((u.hostname === 'raw.githubusercontent.com' && /^\/[^/]+\/[^/]+\/[a-f0-9]{40}\/.+/.test(u.pathname)) ||
    (u.hostname === 'github.com' && /^\/[^/]+\/[^/]+\/blob\/[a-f0-9]{40}\/.+/.test(u.pathname)))) throw Error('Use a commit-pinned GitHub file URL');
  return u.hostname === 'github.com' ? `https://raw.githubusercontent.com${u.pathname.replace('/blob/', '/')}` : u.href;
}
export function validateCatalog(data) {
  if (!data || data.schemaVersion !== 1 || Object.keys(data).some(k => !['schemaVersion','cases'].includes(k)) || !Array.isArray(data.cases) || !data.cases.length || data.cases.length > 200) throw Error('Expected schemaVersion 1 and 1–200 cases');
  const ids = new Set();
  for (const c of data.cases) {
    if (!c || typeof c !== 'object' || Array.isArray(c) || Object.keys(c).some(k => !fields.includes(k))) throw Error('Unknown case fields');
    for (const f of fields.filter(f => f !== 'evidence')) if (typeof c[f] !== 'string' || !c[f].trim() || c[f].length > 16000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(c[f])) throw Error(`Invalid ${f}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id) || ids.has(c.id)) throw Error('Invalid or duplicate id');
    ids.add(c.id);
    if (!['specified','blocked','implemented','verified'].includes(c.status)) throw Error('Invalid status');
    if (!Array.isArray(c.evidence) || c.evidence.length > 20) throw Error('Invalid evidence');
    c.evidence.forEach(pinnedUrl);
    if (c.status !== 'specified' && !c.evidence.length) throw Error('Status requires evidence links; verified remains a reviewed claim');
  }
  return data;
}
