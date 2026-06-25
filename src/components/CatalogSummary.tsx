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

const impactLabels: Record<string, string> = {
  core: 'Core',
  common: 'Common',
  specialized: 'Specialized',
  archival: 'Archival',
  unspecified: 'Unspecified',
};

const scopeLabels: Record<string, string> = {
  architecture: 'Architecture',
  stack: 'Stack',
  runtime: 'Runtime',
  library: 'Library',
  language: 'Language',
  algorithm: 'Algorithm',
  hardware: 'Hardware',
  unspecified: 'Unspecified',
};

const reuseLabels: Record<string, string> = {
  'reference-only': 'Reference only',
  'hand-roll': 'Hand-roll viable',
  'library-preferred': 'Library preferred',
  'design-replaced': 'Design-replaced',
  archival: 'Archival',
};

function labelFor(labels: Record<string, string>, value: string) {
  return labels[value] || value;
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
  const specialized = metrics.impact.specialized || 0;
  const archival = metrics.impact.archival || 0;

  return (
    <section className="catalog-summary card">
      <div>
        <h2>Catalog Signals</h2>
        <p>Use these signals to separate everyday work classes from context-specific topics and mostly archival recognition patterns.</p>
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
          <strong>Usefulness Tiers</strong>
          <span><b>Work-impacting:</b> {workImpacting} core/common</span>
          <span><b>Specialized:</b> {specialized} context-dependent</span>
          <span><b>Archival:</b> {archival} recognition/history</span>
        </div>
        <div className="summary-block summary-wide">
          <strong>Reading Guide</strong>
          <span>Core/common: start here for recurring production decisions.</span>
          <span>Specialized: use when the domain constraint is real.</span>
          <span>Archival: useful vocabulary, but usually not the implementation target.</span>
        </div>
        <div className="summary-block">
          <strong>Impact detail</strong>
          {entries(metrics.impact).map(([label, value]) => (
            <span key={label}>{labelFor(impactLabels, label)}: {value}</span>
          ))}
        </div>
        <div className="summary-block">
          <strong>Scope</strong>
          {entries(metrics.scope).map(([label, value]) => (
            <span key={label}>{labelFor(scopeLabels, label)}: {value}</span>
          ))}
        </div>
        <div className="summary-block">
          <strong>Implementation Posture</strong>
          {entries(metrics.reuse).map(([label, value]) => (
            <span key={label}>{labelFor(reuseLabels, label)}: {value}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
