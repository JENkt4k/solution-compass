import React, { useMemo, useState } from 'react';
import { ProblemNode } from '../hooks/useTreeData';

type EvaluationRole = {
  name: string;
  summary: string;
  bestSignals: string[];
  weakSignals: string[];
  exercises: string[];
  relatedProblems: string[];
};

const focusAreas = [
  'Coding fluency',
  'Debugging',
  'System design',
  'Tradeoffs',
  'Delivery ownership',
  'Cost / scale judgment',
] as const;

const roles: EvaluationRole[] = [
  {
    name: 'Application Developer',
    summary: 'Evaluate whether they can ship maintainable product features with appropriate data modeling, APIs, and tests.',
    bestSignals: [
      'Turns vague requirements into a simple data model and workflow',
      'Uses framework conventions and avoids needless infrastructure',
      'Can explain error handling, validation, and user-visible failure modes',
    ],
    weakSignals: [
      'LeetCode alone says little about product judgment or maintainability',
      'Toy CRUD without edge cases misses ownership and debugging behavior',
    ],
    exercises: [
      'Extend a small CRUD flow with validation, authorization, and a migration',
      'Debug a broken API/UI state mismatch from logs and code',
      'Explain when a cache or queue would be premature',
    ],
    relatedProblems: ['CRUD & Data Modeling', 'Caching', 'Workflow / State Modeling', 'Observability'],
  },
  {
    name: 'Backend / API Engineer',
    summary: 'Evaluate correctness, service boundaries, data consistency, failure handling, and operational maturity.',
    bestSignals: [
      'Models transactions, idempotency, retries, and pagination clearly',
      'Chooses database, cache, queue, and search responsibilities deliberately',
      'Can reason about latency budgets and production debugging',
    ],
    weakSignals: [
      'Algorithm puzzles miss most API correctness and operational tradeoffs',
      'Whiteboard microservices without data ownership are a weak signal',
    ],
    exercises: [
      'Design an order or billing API with retries and idempotency',
      'Diagnose a slow endpoint using traces, database plans, and cache behavior',
      'Compare queue, transaction, and workflow approaches for a side effect',
    ],
    relatedProblems: ['CRUD & Data Modeling', 'Stream / Event Processing', 'Caching', 'Search / Retrieval', 'Observability'],
  },
  {
    name: 'Platform / DevOps Engineer',
    summary: 'Evaluate reliability, deployment safety, observability, cost controls, and developer enablement.',
    bestSignals: [
      'Can define SLOs, rollout strategy, and rollback paths',
      'Balances managed services against ownership and cost',
      'Improves paved roads without blocking product teams',
    ],
    weakSignals: [
      'Cloud trivia does not prove incident judgment',
      'Kubernetes-first answers can hide simpler platform options',
    ],
    exercises: [
      'Create a deployment plan with health checks, rollback, and observability',
      'Triage an incident from metrics, logs, and traces',
      'Reduce platform cost without harming reliability',
    ],
    relatedProblems: ['System Architecture Patterns', 'Observability', 'AI / App Deployment & Serving', 'Runtime / Compiler Choices'],
  },
  {
    name: 'Data Engineer',
    summary: 'Evaluate data contracts, freshness, lineage, quality, batch/stream choices, and warehouse modeling.',
    bestSignals: [
      'Separates ingestion, transformation, serving, and ownership concerns',
      'Understands ETL vs ELT and when streaming is actually needed',
      'Builds checks for freshness, duplicates, schema drift, and backfills',
    ],
    weakSignals: [
      'SQL trivia misses pipeline ownership and data quality judgment',
      'Big data tool lists do not prove modeling skill',
    ],
    exercises: [
      'Design a source-to-dashboard pipeline with data quality checks',
      'Plan a backfill after a source schema change',
      'Choose batch, streaming, or hybrid ingestion for a freshness requirement',
    ],
    relatedProblems: ['Batch / ETL Processing', 'Stream / Event Processing', 'CRUD & Data Modeling', 'Observability'],
  },
  {
    name: 'AI / ML Engineer',
    summary: 'Evaluate model/data fit, evaluation quality, serving constraints, and whether ML is justified.',
    bestSignals: [
      'Starts with baseline metrics, labeled data, and evaluation design',
      'Knows when retrieval, rules, or simpler models beat model tuning',
      'Can reason about latency, privacy, cost, drift, and monitoring',
    ],
    weakSignals: [
      'Notebook demos without evals are a weak production signal',
      'Model-name fluency does not prove deployment or data judgment',
    ],
    exercises: [
      'Build an eval plan for a RAG or classification task',
      'Compare managed API, local inference, and fine-tuning for a constraint set',
      'Diagnose bad model output using data, retrieval, and prompt/version evidence',
    ],
    relatedProblems: ['Machine Learning / AI', 'AI / LLM Systems', 'Vector Search / Embeddings', 'AI / App Deployment & Serving'],
  },
  {
    name: 'Systems Architect / Staff+',
    summary: 'Evaluate problem framing, tradeoff clarity, sequencing, risk management, and cross-team technical leadership.',
    bestSignals: [
      'Identifies the dominant constraint before choosing architecture',
      'Can sequence migration steps while protecting delivery',
      'Explains cost, reliability, data ownership, and team boundaries',
    ],
    weakSignals: [
      'Grand architecture diagrams without migration steps are a weak signal',
      'Puzzle performance does not predict organizational judgment',
    ],
    exercises: [
      'Assess a current platform and propose the smallest valuable architecture change',
      'Write a decision record with alternatives and explicit tradeoffs',
      'Review a scaling incident and separate technical from ownership failures',
    ],
    relatedProblems: ['System Architecture Patterns', 'Observability', 'Stream / Event Processing', 'Security & Cryptography'],
  },
  {
    name: 'FEA / Scientific Applications Engineer',
    summary: 'Evaluate whether they can connect domain physics, numerical methods, software automation, and validation evidence.',
    bestSignals: [
      'Separates physical assumptions, numerical artifacts, and software defects',
      'Uses convergence, benchmarks, and validation data before trusting results',
      'Can automate repeatable studies without hiding engineering judgment',
    ],
    weakSignals: [
      'Tool-button fluency does not prove solver or modeling judgment',
      'Attractive contour plots are weak evidence without assumptions and validation',
    ],
    exercises: [
      'Compare two solver workflows for a nonlinear/contact or thermal problem',
      'Review an FEA result and identify mesh, boundary condition, and validation risks',
      'Automate a small parametric study with versioned inputs and result checks',
    ],
    relatedProblems: ['Engineering Simulation / FEA', 'Hydrology / Cartographic Generalization', 'Performance / Hardware Acceleration', 'Runtime / Compiler Choices'],
  },
];

const focusGuidance: Record<typeof focusAreas[number], string[]> = {
  'Coding fluency': [
    'Use small implementation tasks and code review, not only puzzle speed.',
    'LeetCode is useful as a baseline for fundamentals, strongest for junior/mid screens.',
    'Prefer tasks that reveal tests, naming, edge cases, and library judgment.',
  ],
  Debugging: [
    'Give logs, symptoms, and partial code; watch hypothesis quality.',
    'Strong candidates narrow the search and verify assumptions quickly.',
    'This is often more predictive than greenfield coding for production roles.',
  ],
  'System design': [
    'Start with workload, constraints, data ownership, and failure modes.',
    'Score tradeoff reasoning higher than naming fashionable tools.',
    'Ask for the first migration step, not only the final architecture.',
  ],
  Tradeoffs: [
    'Ask what they would not build and why.',
    'Look for cost, complexity, reliability, and team-skill reasoning.',
    'Good answers include conditions that would change the decision.',
  ],
  'Delivery ownership': [
    'Evaluate sequencing, rollout, observability, docs, and rollback.',
    'Strong candidates reduce risk while preserving momentum.',
    'Ask how they would know the work succeeded after shipping.',
  ],
  'Cost / scale judgment': [
    'Ask for dominant cost drivers before optimization tactics.',
    'Look for managed-vs-owned service reasoning and data movement awareness.',
    'Scale answers should include measurement and a simpler starting point.',
  ],
};

function relatedCatalog(data: ProblemNode[], role: EvaluationRole) {
  return role.relatedProblems
    .map((problem) => data.find((node) => node.problem === problem))
    .filter(Boolean) as ProblemNode[];
}

function renderList(items: string[]) {
  return (
    <ul>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default function EvaluationMode({ data, onFocus }: { data: ProblemNode[]; onFocus: (problem: string) => void }) {
  const [roleName, setRoleName] = useState(roles[0].name);
  const [focusArea, setFocusArea] = useState<typeof focusAreas[number]>(focusAreas[0]);
  const selectedRole = roles.find((role) => role.name === roleName) || roles[0];
  const catalogAreas = useMemo(() => relatedCatalog(data, selectedRole), [data, selectedRole]);

  return (
    <section className="evaluation-mode card">
      <div className="evaluation-header">
        <div>
          <h2>Evaluation Mode</h2>
          <p>Assess role fit with work-relevant signals, not just puzzle performance.</p>
        </div>
      </div>

      <div className="evaluation-controls">
        <fieldset className="wizard-question">
          <legend>Role</legend>
          <div className="segmented">
            {roles.map((role) => (
              <button
                className={`segment ${selectedRole.name === role.name ? 'active' : ''}`}
                key={role.name}
                type="button"
                onClick={() => setRoleName(role.name)}
              >
                {role.name}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="wizard-question">
          <legend>Evaluation focus</legend>
          <div className="segmented">
            {focusAreas.map((area) => (
              <button
                className={`segment ${focusArea === area ? 'active' : ''}`}
                key={area}
                type="button"
                onClick={() => setFocusArea(area)}
              >
                {area}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="evaluation-summary">
        <div>
          <strong>{selectedRole.name}</strong>
          <p>{selectedRole.summary}</p>
        </div>
        <div>
          <strong>{focusArea}</strong>
          {renderList(focusGuidance[focusArea])}
        </div>
      </div>

      <div className="evaluation-grid">
        <article>
          <strong>Best signals</strong>
          {renderList(selectedRole.bestSignals)}
        </article>
        <article>
          <strong>Weak signals</strong>
          {renderList(selectedRole.weakSignals)}
        </article>
        <article>
          <strong>Practical exercises</strong>
          {renderList(selectedRole.exercises)}
        </article>
      </div>

      <div className="zoom-recommendations">
        <strong>Related catalog areas</strong>
        <div className="zoom-recommendation-grid">
          {catalogAreas.map((node) => (
            <button className="zoom-result" type="button" key={node.problem} onClick={() => onFocus(node.problem)}>
              <span>{node.scopeLevel} / {node.impactLevel}</span>
              <strong>{node.problem}</strong>
              {node.firstMove && <small>{node.firstMove}</small>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
