import React, { useMemo } from 'react';
import { ProblemNode, Solution } from '../hooks/useTreeData';

type CompareRow = {
  problem: ProblemNode;
  patternName: string;
  solution: Solution;
};

type Props = {
  data: ProblemNode[];
  onFocusProblem: (problem: string) => void;
};

function flattenRows(data: ProblemNode[]) {
  return data.flatMap((problem) =>
    (problem.patterns || []).flatMap((pattern) =>
      (pattern.solutions || []).map((solution) => ({
        problem,
        patternName: pattern.name,
        solution,
      })),
    ),
  );
}

function short(value?: string) {
  return value && value.trim() ? value : '-';
}

function problemMeta(problem: ProblemNode) {
  return [problem.scopeLevel, problem.impactLevel, problem.complexity, problem.setupCost, problem.maturity].filter(Boolean).join(' / ');
}

export default function CompareTable({ data, onFocusProblem }: Props) {
  const rows = useMemo<CompareRow[]>(() => flattenRows(data), [data]);

  if (!rows.length) {
    return <div className="card">No solutions to compare.</div>;
  }

  return (
    <section className="compare card">
      <div className="compare-header">
        <div>
          <h2>Compare Solutions</h2>
          <p>{rows.length} visible solution{rows.length === 1 ? '' : 's'} from the current filters.</p>
        </div>
      </div>

      <div className="compare-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Problem</th>
              <th>Pattern</th>
              <th>Scope</th>
              <th>Impact</th>
              <th>Solution</th>
              <th>Tool</th>
              <th>Language</th>
              <th>Fit</th>
              <th>Time</th>
              <th>Space</th>
              <th>Reference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                className="clickable-row"
                key={`${row.problem.problem}::${row.patternName}::${row.solution.name}::${row.solution.tool}`}
                tabIndex={0}
                onClick={() => onFocusProblem(row.problem.problem)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onFocusProblem(row.problem.problem);
                  }
                }}
              >
                <td>
                  <button className="table-link" type="button" onClick={() => onFocusProblem(row.problem.problem)}>
                    {row.problem.problem}
                  </button>
                  <span className="table-subtext">{problemMeta(row.problem)}</span>
                </td>
                <td>{row.patternName}</td>
                <td>{short(row.problem.scopeLevel)}</td>
                <td>{short(row.problem.impactLevel)}</td>
                <td>
                  <strong>{row.solution.name}</strong>
                  {row.solution.blurb && <span className="table-subtext">{row.solution.blurb}</span>}
                </td>
                <td>{row.solution.tool}</td>
                <td>{row.solution.language}</td>
                <td>{short(row.problem.scale)}</td>
                <td>{short(row.solution.timeComplexity)}</td>
                <td>{short(row.solution.spaceComplexity)}</td>
                <td>
                  {row.solution.url ? (
                    <a
                      className="reference-link"
                      href={row.solution.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Open
                    </a>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
