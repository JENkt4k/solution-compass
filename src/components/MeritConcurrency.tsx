import React, { useState } from 'react';
import catalog from '../data/merit-concurrency.json';

export default function MeritConcurrency() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(catalog.cases[0].id);
  const [mode, setMode] = useState('documentation');
  const [copyMessage, setCopyMessage] = useState('');
  const cases = catalog.cases.filter(c => JSON.stringify(c).toLowerCase().includes(query.toLowerCase()));
  const item = cases.find(c => c.id === selected) || cases[0];
  const fields = item ? mode === 'documentation'
    ? [['Problem', item.documentation], ['Execution', item.execution], ['Consistency', item.consistency]]
    : [['Correctness contract', item.contract], ['Execution', item.execution], ['Consistency', item.consistency], ['Ownership and resources', item.ownership], ['Adversarial cases', item.hardened], ['Verification', item.verification], ['Measurements', item.metrics], ...(mode === 'hardened' ? [['Input validation', item.inputPolicy]] : [])] : [];
  const prompt = item ? `Implement Merit concurrency case ${item.id}: ${item.title}\n\n${JSON.stringify(item, null, 2)}\n\nInspect the current Merit repository and approved RM0 first. Produce a documentation version, a precise safe implementation, and a verbose hardened variant with input validation. Keep their valid-input semantics identical. Do not silently sanitize financial data. Use only implemented syntax and capabilities. Mark unsupported requirements as blocked with concrete evidence; never invent APIs or change language semantics. Include compiler version, source commit, commands, seed, schedule, oracle, test results and limitations. Separate compile-fail cases, runtime checks, protocol guarantees, durability and performance. Link source/results using commit-pinned GitHub URLs. Do not claim proof from benchmarks.` : '';
  return <details className="card merit-concurrency">
    <summary><strong>Merit concurrency test cases</strong> — {catalog.cases.length} specifications</summary>
    <p>Reference workloads for evaluating Merit. “Specified” means a proposed test contract, not implemented or passing language support. Execution, consistency, memory safety, durability and domain correctness require separate evidence.</p>
    <label>Find a case <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ledger, actor, tensor, payroll…" /></label>
    <p><label>Case <select style={{maxWidth:'100%'}} value={item?.id || ''} onChange={e => { setSelected(e.target.value); setCopyMessage(''); }}>
      {cases.map(c => <option key={c.id} value={c.id}>{c.title} ({c.status})</option>)}
    </select></label></p>
    <div className="view-toggle" aria-label="Specification detail">
      {['documentation', 'precise', 'hardened'].map(value => <button type="button" className={`segment ${mode === value ? 'active' : ''}`} key={value} onClick={() => setMode(value)}>{value === 'hardened' ? 'Verbose / input validation' : value === 'precise' ? 'Safe / precise' : 'Documentation'}</button>)}
    </div>
    {!item ? <p>No matching cases.</p> : <>
      <h3>{item.title}</h3>
      <dl>{fields.map(([label, value]) => <React.Fragment key={label}><dt><strong>{label}</strong></dt><dd>{value}</dd></React.Fragment>)}</dl>
      <p>Evidence: {item.evidence.length ? item.evidence.map((url: string) => <a key={url} href={url} target="_blank" rel="noreferrer">Source / result </a>) : 'No implementation evidence attached.'}</p>
      <button type="button" className="btn" onClick={async () => { try { await navigator.clipboard.writeText(prompt); setCopyMessage('Copied Codex implementation prompt.'); } catch { setCopyMessage('Clipboard unavailable. Select the prompt below to copy.'); } }}>Copy Codex prompt</button>
      <span role="status"> {copyMessage}</span>
      <details><summary>Implementation prompt</summary><pre style={{whiteSpace:'pre-wrap', overflowWrap:'anywhere'}}>{prompt}</pre></details>
    </>}
  </details>;
}
