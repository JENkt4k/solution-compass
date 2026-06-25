import React, { useMemo } from 'react';
import { ProblemNode } from '../hooks/useTreeData';

type Props = {
  data: ProblemNode[];
};

function countBy(items: string[]) {
  return items.reduce<Record<string, number>>((counts, item) => {
    counts[item || 'unspecified'] = (counts[item || 'unspecified'] || 0) + 1;
    return counts;
  }, {});
}

function entries(counts: Record<string, number>) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

export default function CatalogSummary({ data }: Props) {
  const metrics = useMemo(() => {
    const solutions = data.flatMap((problem) =>
      (problem.patterns || []).flatMap((pattern) => pattern.solutions || []),
    );

    return {
      problems: data.length,
      patterns: data.reduce((total, problem) => total + (problem.patterns || []).length, 0),
      solutions: solutions.length,
      snippets: solutions.filter((solution) => solution.code).length,
      impact: countBy(data.map((problem) => problem.impactLevel || 'unspecified')),
      scope: countBy(data.map((problem) => problem.scopeLevel || 'unspecified')),
      reuse: countBy(solutions.map((solution) => solution.reuseLevel || 'reference-only')),
    };
  }, [data]);

  const workImpacting = (metrics.impact.core || 0) + (metrics.impact.common || 0);
  const lowerPriority = (metrics.impact.specialized || 0) + (metrics.impact.archival || 0);

  return (
    <section className="catalog-summary card">
      <div>
        <h2>Catalog Signals</h2>
        <p>Core and common entries are prioritized as work-impacting classes; archival entries are retained for recognition and historical context.</p>
      </div>
      <div className="summary-grid">
        <div className="summary-block">
          <strong>Coverage</strong>
          <span>{metrics.problems} problems</span>
          <span>{metrics.patterns} patterns</span>
          <span>{metrics.solutions} solutions</span>
          <span>{metrics.snippets} snippets</span>
        </div>
        <div className="summary-block">
          <strong>Usefulness</strong>
          <span>work-impacting: {workImpacting}</span>
          <span>context-specific/archive: {lowerPriority}</span>
        </div>
        <div className="summary-block">
          <strong>Impact detail</strong>
          {entries(metrics.impact).map(([label, value]) => <span key={label}>{label}: {value}</span>)}
        </div>
        <div className="summary-block">
          <strong>Scope</strong>
          {entries(metrics.scope).map(([label, value]) => <span key={label}>{label}: {value}</span>)}
        </div>
        <div className="summary-block">
          <strong>Implementation</strong>
          {entries(metrics.reuse).map(([label, value]) => <span key={label}>{label}: {value}</span>)}
        </div>
      </div>
    </section>
  );
}
