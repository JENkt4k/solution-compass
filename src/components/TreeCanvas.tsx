import React, { useEffect, useMemo, useState } from 'react';
import { ProblemNode } from '../hooks/useTreeData';

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

export default function TreeCanvas({ data, expandAllVersion, collapseAllVersion, query }: Props) {
  // expansion state: problem index -> boolean, pattern key -> boolean
  const [openProblems, setOpenProblems] = useState<Record<string, boolean>>({});
  const [openPatterns, setOpenPatterns] = useState<Record<string, boolean>>({});

  // expand/collapse all handlers via version ticks from parent
  useEffect(() => {
    // expand all
    const p: Record<string, boolean> = {};
    const pt: Record<string, boolean> = {};
    data.forEach((problem, pi) => {
      const pKey = problem.problem;
      p[pKey] = true;
      (problem.patterns || []).forEach((pattern, pti) => {
        pt[`${pKey}::${pattern.name}`] = true;
      });
    });
    setOpenProblems(p);
    setOpenPatterns(pt);
  }, [expandAllVersion, data]);

  useEffect(() => {
    // collapse all
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
            <header className="card-header" onClick={() => toggleProblem(pKey)}>
              <button className="chevron" aria-label="toggle">{pOpen ? '▾' : '▸'}</button>
              <div className="titleblock">
                <h3 className="card-title">{highlight(problem.problem, query)}</h3>
                {problem.subcategory && <div className="muted"><em>{highlight(problem.subcategory, query)}</em></div>}
                <div className="tags">{
                  (problem.tags || []).map((t) => <span className="tag" key={t}>{highlight(t, query)}</span>)
                }</div>
                {problem.examples && problem.examples.length > 0 && (
                  <div className="examples">Examples: {problem.examples.map((ex, i) => (
                    <span key={i} className="example">{highlight(ex, query)}{i < problem.examples!.length - 1 ? ', ' : ''}</span>
                  ))}</div>
                )}
              </div>
            </header>

            {pOpen && (
              <div className="patterns">
                {(problem.patterns || []).map((pattern) => {
                  const ptKey = `${pKey}::${pattern.name}`;
                  const ptOpen = !!openPatterns[ptKey];
                  return (
                    <div key={ptKey} className="pattern">
                      <div className="pattern-header" onClick={() => togglePattern(ptKey)}>
                        <button className="chevron small">{ptOpen ? '▾' : '▸'}</button>
                        <h4 className="pattern-title">{highlight(pattern.name, query)}</h4>
                      </div>
                      {ptOpen && (
                        <ul className="solutions">
                          {(pattern.solutions || []).map((s, idx) => (
                            <li key={idx} className="solution">
                              <span className="s-name">{highlight(s.name, query)}</span>
                              <span className="sep">—</span>
                              <span className="s-tool">{highlight(s.tool, query)}</span>
                              <span className="s-lang">({highlight(s.language, query)})</span>
                            </li>
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