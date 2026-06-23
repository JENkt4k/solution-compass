import React, { useEffect, useMemo, useState } from 'react';
import { ProblemNode, Solution } from '../hooks/useTreeData';

type Props = {
  data: ProblemNode[];
  expandAllVersion: number;
  collapseAllVersion: number;
  query: string;
};

function highlight(text: string, q: string) {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const mid = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);
  return <>{before}<mark>{mid}</mark>{after}</>;
}

function SolutionItem({ solution, query }: { solution: Solution; query: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!solution.code) return;
    await navigator.clipboard.writeText(solution.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <li className="solution">
      <div className="solution-heading">
        <span className="s-name">{highlight(solution.name, query)}</span>
        <span className="sep">-</span>
        <span className="s-tool">{highlight(solution.tool, query)}</span>
        <span className="s-lang">({highlight(solution.language, query)})</span>
        {solution.url && (
          <a className="reference-link" href={solution.url} target="_blank" rel="noreferrer">
            Reference
          </a>
        )}
      </div>
      {solution.blurb && <p className="solution-blurb">{highlight(solution.blurb, query)}</p>}
      {solution.code && (
        <div className="code-block">
          <div className="code-toolbar">
            <span>Snippet</span>
            <button className="copy-btn" type="button" onClick={copyCode}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre><code>{solution.code}</code></pre>
        </div>
      )}
    </li>
  );
}

export default function TreeCanvas({ data, expandAllVersion, collapseAllVersion, query }: Props) {
  const [openProblems, setOpenProblems] = useState<Record<string, boolean>>({});
  const [openPatterns, setOpenPatterns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (expandAllVersion === 0) {
      return;
    }

    const p: Record<string, boolean> = {};
    const pt: Record<string, boolean> = {};
    data.forEach((problem) => {
      const pKey = problem.problem;
      p[pKey] = true;
      (problem.patterns || []).forEach((pattern) => {
        pt[`${pKey}::${pattern.name}`] = true;
      });
    });
    setOpenProblems(p);
    setOpenPatterns(pt);
  }, [expandAllVersion, data]);

  useEffect(() => {
    setOpenProblems({});
    setOpenPatterns({});
  }, [collapseAllVersion]);

  const toggleProblem = (key: string) => setOpenProblems((s) => ({ ...s, [key]: !s[key] }));
  const togglePattern = (key: string) => setOpenPatterns((s) => ({ ...s, [key]: !s[key] }));

  const rendered = useMemo(() => data, [data]);

  if (!rendered.length) {
    return <div className="card">No results.</div>;
  }

  return (
    <div className="grid">
      {rendered.map((problem) => {
        const pKey = problem.problem;
        const pOpen = !!openProblems[pKey];
        return (
          <section key={pKey} className="card">
            <button
              className="card-header toggle-row"
              type="button"
              aria-expanded={pOpen}
              onClick={() => toggleProblem(pKey)}
            >
              <span className="chevron" aria-hidden="true">{pOpen ? 'v' : '>'}</span>
              <span className="titleblock">
                <span className="card-title">{highlight(problem.problem, query)}</span>
                {problem.subcategory && <span className="muted"><em>{highlight(problem.subcategory, query)}</em></span>}
                {problem.description && <span className="description">{highlight(problem.description, query)}</span>}
                <span className="decision-meta card-meta">
                  {problem.complexity && <span>Complexity: {highlight(problem.complexity, query)}</span>}
                  {problem.setupCost && <span>Setup: {highlight(problem.setupCost, query)}</span>}
                  {problem.maturity && <span>{highlight(problem.maturity, query)}</span>}
                </span>
                <span className="tags">
                  {(problem.tags || []).map((t) => <span className="tag" key={t}>{highlight(t, query)}</span>)}
                </span>
                {problem.examples && problem.examples.length > 0 && (
                  <span className="examples">Examples: {problem.examples.map((ex, i) => (
                    <span key={i} className="example">{highlight(ex, query)}{i < problem.examples!.length - 1 ? ', ' : ''}</span>
                  ))}</span>
                )}
              </span>
            </button>

            {pOpen && (
              <div className="patterns">
                {(problem.bestFor || problem.avoidWhen || problem.tradeoffs) && (
                  <div className="decision-details">
                    {problem.bestFor && (
                      <div>
                        <strong>Best for</strong>
                        <ul>{problem.bestFor.slice(0, 4).map((item) => <li key={item}>{highlight(item, query)}</li>)}</ul>
                      </div>
                    )}
                    {problem.avoidWhen && (
                      <div>
                        <strong>Avoid when</strong>
                        <ul>{problem.avoidWhen.slice(0, 3).map((item) => <li key={item}>{highlight(item, query)}</li>)}</ul>
                      </div>
                    )}
                    {problem.tradeoffs && (
                      <div>
                        <strong>Tradeoffs</strong>
                        <ul>{problem.tradeoffs.slice(0, 3).map((item) => <li key={item}>{highlight(item, query)}</li>)}</ul>
                      </div>
                    )}
                  </div>
                )}
                {(problem.patterns || []).map((pattern) => {
                  const ptKey = `${pKey}::${pattern.name}`;
                  const ptOpen = !!openPatterns[ptKey];
                  return (
                    <div key={ptKey} className="pattern">
                      <button
                        className="pattern-header toggle-row"
                        type="button"
                        aria-expanded={ptOpen}
                        onClick={() => togglePattern(ptKey)}
                      >
                        <span className="chevron small" aria-hidden="true">{ptOpen ? 'v' : '>'}</span>
                        <span className="pattern-title">{highlight(pattern.name, query)}</span>
                      </button>
                      {ptOpen && (
                        <ul className="solutions">
                          {(pattern.solutions || []).map((s) => (
                            <SolutionItem key={`${s.name}-${s.tool}-${s.language}`} solution={s} query={query} />
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
