import React, { useEffect, useMemo, useState } from 'react';
import { ProblemNode, Solution } from '../hooks/useTreeData';
import { slugify } from '../utils/slug';
import { classifySource } from '../utils/sourceAuthority';

type Props = {
  data: ProblemNode[];
  expandAllVersion: number;
  collapseAllVersion: number;
  query: string;
  activeTag: string;
  focusedProblemSlug: string;
  onTagClick: (tag: string) => void;
  onProblemLink: (problem: string) => void;
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
  const source = classifySource(solution.url);

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
        {solution.url && (
          <span className={`source-badge source-${source.authority}`}>{source.label}</span>
        )}
      </div>
      {solution.blurb && <p className="solution-blurb">{highlight(solution.blurb, query)}</p>}
      {(solution.reuseLevel || solution.implementationNote) && (
        <div className="implementation-row">
          {solution.reuseLevel && <span>Use: {highlight(solution.reuseLevel, query)}</span>}
          {solution.implementationNote && <span>{highlight(solution.implementationNote, query)}</span>}
        </div>
      )}
      {(solution.timeComplexity || solution.spaceComplexity) && (
        <div className="complexity-row">
          {solution.timeComplexity && <span>Time: {highlight(solution.timeComplexity, query)}</span>}
          {solution.spaceComplexity && <span>Space: {highlight(solution.spaceComplexity, query)}</span>}
        </div>
      )}
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

export default function TreeCanvas({
  data,
  expandAllVersion,
  collapseAllVersion,
  query,
  activeTag,
  focusedProblemSlug,
  onTagClick,
  onProblemLink,
}: Props) {
  const [openProblems, setOpenProblems] = useState<Record<string, boolean>>({});
  const [openPatterns, setOpenPatterns] = useState<Record<string, boolean>>({});
  const [copiedProblem, setCopiedProblem] = useState('');

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

  const copyProblemLink = async (problem: string) => {
    const slug = slugify(problem);
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#/problem/${slug}`;
    await navigator.clipboard.writeText(url);
    onProblemLink(problem);
    setCopiedProblem(problem);
    window.setTimeout(() => setCopiedProblem(''), 1600);
  };

  const rendered = useMemo(() => data, [data]);

  if (!rendered.length) {
    return <div className="card">No results.</div>;
  }

  return (
    <div className="grid">
      {rendered.map((problem) => {
        const pKey = problem.problem;
        const problemSlug = slugify(problem.problem);
        const isFocused = problemSlug === focusedProblemSlug;
        const pOpen = !!openProblems[pKey] || isFocused;
        return (
          <section key={pKey} id={`problem-${problemSlug}`} className={`card${isFocused ? ' focused-card' : ''}`}>
            <div className="card-header">
              <button
                className="chevron"
                type="button"
                aria-expanded={pOpen}
                aria-label={`${pOpen ? 'Collapse' : 'Expand'} ${problem.problem}`}
                onClick={() => toggleProblem(pKey)}
              >
                {pOpen ? 'v' : '>'}
              </button>
              <span className="titleblock">
                <span className="titleline">
                  <button className="title-button" type="button" onClick={() => toggleProblem(pKey)}>
                    {highlight(problem.problem, query)}
                  </button>
                  <button className="link-btn" type="button" onClick={() => copyProblemLink(problem.problem)}>
                    {copiedProblem === problem.problem ? 'Copied' : 'Link'}
                  </button>
                </span>
                {problem.subcategory && <span className="muted"><em>{highlight(problem.subcategory, query)}</em></span>}
                {problem.description && <span className="description">{highlight(problem.description, query)}</span>}
                <span className="decision-meta card-meta">
                  {problem.scopeLevel && <span>Scope: {highlight(problem.scopeLevel, query)}</span>}
                  {problem.impactLevel && <span>Impact: {highlight(problem.impactLevel, query)}</span>}
                  {problem.complexity && <span>Complexity: {highlight(problem.complexity, query)}</span>}
                  {problem.setupCost && <span>Setup: {highlight(problem.setupCost, query)}</span>}
                  {problem.maturity && <span>{highlight(problem.maturity, query)}</span>}
                </span>
                <span className="tags">
                  {(problem.tags || []).map((t) => (
                    <button
                      className={`tag tag-button${t.toLowerCase() === activeTag.toLowerCase() ? ' active' : ''}`}
                      type="button"
                      key={t}
                      onClick={() => onTagClick(t)}
                    >
                      {highlight(t, query)}
                    </button>
                  ))}
                </span>
                {problem.examples && problem.examples.length > 0 && (
                  <span className="examples">Examples: {problem.examples.map((ex, i) => (
                    <span key={i} className="example">{highlight(ex, query)}{i < problem.examples!.length - 1 ? ', ' : ''}</span>
                  ))}</span>
                )}
              </span>
            </div>

            {pOpen && (
              <div className="patterns">
                {(problem.firstMove || problem.bestFor || problem.avoidWhen || problem.tradeoffs) && (
                  <div className="decision-details">
                    {problem.firstMove && (
                      <div>
                        <strong>First move</strong>
                        <p>{highlight(problem.firstMove, query)}</p>
                      </div>
                    )}
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
                  const ptOpen = !!openPatterns[ptKey] || isFocused;
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
