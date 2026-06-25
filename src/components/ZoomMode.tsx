import React, { useMemo, useState } from 'react';
import { ProblemNode } from '../hooks/useTreeData';

type ZoomOption = {
  label: string;
  terms: string[];
};

type PlatformTrack = {
  domain: string;
  workloads: string[];
  architecture: string[];
  stack: string[];
  patterns: string[];
  implementation: string[];
  deliverables: string[];
  problemRefs: string[];
};

const goals: ZoomOption[] = [
  { label: 'Cost reduction', terms: ['cost', 'cache', 'managed', 'batch', 'optimize'] },
  { label: 'Speed to market', terms: ['low setup', 'managed', 'crud', 'workflow', 'saas'] },
  { label: 'Reliability', terms: ['observability', 'retries', 'idempotency', 'slo', 'workflow'] },
  { label: 'Scale', terms: ['distributed', 'stream', 'search', 'cache', 'warehouse'] },
  { label: 'AI capability', terms: ['ai', 'llm', 'rag', 'vector', 'inference'] },
  { label: 'Developer productivity', terms: ['platform', 'runtime', 'workflow', 'architecture'] },
];

const tracks: PlatformTrack[] = [
  {
    domain: 'SaaS / CRM',
    workloads: ['CRUD', 'Search', 'Workflow', 'Reporting'],
    architecture: ['Modular monolith first', 'Service boundaries by ownership', 'Async workers for slow side effects'],
    stack: ['Postgres', 'Redis', 'Search service', 'Queue', 'Object storage', 'OpenTelemetry'],
    patterns: ['Data modeling', 'Caching', 'Authorization', 'Background jobs', 'Observability'],
    implementation: ['Schema and tenancy model', 'API contracts', 'Queue workers', 'Cache policy', 'Runbook'],
    deliverables: ['Context diagram', 'Data model sketch', 'ADR', 'Migration checklist', 'SLO draft'],
    problemRefs: ['CRUD & Data Modeling', 'Caching', 'Search / Retrieval', 'Workflow / State Modeling', 'Observability'],
  },
  {
    domain: 'Retail / Marketplace',
    workloads: ['Catalog', 'Checkout', 'Inventory', 'Recommendations', 'Payments'],
    architecture: ['Transactional core', 'Event-driven inventory and fulfillment', 'Read models for catalog/search'],
    stack: ['Postgres', 'Redis', 'Search index', 'Event stream', 'Payment provider', 'Warehouse'],
    patterns: ['Transactions', 'CQRS/read models', 'Idempotency', 'Caching', 'Event contracts'],
    implementation: ['Order state machine', 'Inventory consistency rules', 'Payment idempotency keys', 'Search indexing flow'],
    deliverables: ['Order lifecycle diagram', 'Event contract', 'Failure-mode checklist', 'Cost driver list'],
    problemRefs: ['CRUD & Data Modeling', 'Stream / Event Processing', 'Search / Retrieval', 'Caching', 'System Architecture Patterns'],
  },
  {
    domain: 'Social / Feed',
    workloads: ['Posts', 'Comments', 'Feed ranking', 'Notifications', 'Moderation'],
    architecture: ['Write path separate from feed read models', 'Fanout strategy by scale', 'Async moderation pipeline'],
    stack: ['Primary database', 'Cache', 'Search index', 'Event stream', 'Feature store or ranking service'],
    patterns: ['Feed generation', 'Ranking', 'Caching', 'Event streaming', 'Backpressure'],
    implementation: ['Feed materialization strategy', 'Notification worker', 'Moderation queue', 'Ranking evaluation loop'],
    deliverables: ['Read/write path diagram', 'Fanout decision record', 'Latency budget', 'Abuse/moderation checklist'],
    problemRefs: ['Stream / Event Processing', 'Caching', 'Search / Retrieval', 'Machine Learning / AI', 'System Architecture Patterns'],
  },
  {
    domain: 'Video / Media',
    workloads: ['Upload', 'Transcode', 'Streaming', 'Search', 'Recommendations'],
    architecture: ['Object storage source of truth', 'Queue-based processing', 'CDN delivery', 'Metadata/search sidecar'],
    stack: ['Object storage', 'Queue', 'Worker pool', 'CDN', 'Metadata DB', 'Search/vector index'],
    patterns: ['Batch processing', 'Workflow orchestration', 'Caching/CDN', 'Observability', 'Hardware acceleration'],
    implementation: ['Transcode pipeline', 'Retry/dead-letter policy', 'Asset metadata schema', 'CDN invalidation policy'],
    deliverables: ['Media pipeline diagram', 'Processing SLA', 'Storage lifecycle policy', 'Cost model'],
    problemRefs: ['Workflow / State Modeling', 'Batch / ETL Processing', 'Caching', 'Performance / Hardware Acceleration', 'Observability'],
  },
  {
    domain: 'Data Warehouse / Analytics',
    workloads: ['Ingestion', 'Transform', 'Modeling', 'BI', 'Reverse ETL'],
    architecture: ['ELT/lakehouse when warehouse is central', 'Orchestrated batch first', 'Streaming only for true freshness needs'],
    stack: ['Warehouse/lakehouse', 'dbt', 'Airflow/Dagster', 'Spark/Flink', 'Data quality checks'],
    patterns: ['ETL/ELT', 'Schema evolution', 'Data contracts', 'Batch orchestration', 'Observability'],
    implementation: ['Source contracts', 'Transform graph', 'Freshness checks', 'Backfill plan', 'Lineage notes'],
    deliverables: ['Data flow diagram', 'Source-to-metric map', 'Quality checklist', 'Backfill runbook'],
    problemRefs: ['Batch / ETL Processing', 'Stream / Event Processing', 'CRUD & Data Modeling', 'Observability'],
  },
  {
    domain: 'AI / RAG App',
    workloads: ['Retrieval', 'Generation', 'Memory', 'Evaluation', 'Model serving'],
    architecture: ['Evaluation loop before tool choice', 'Retrieval pipeline separated from answer generation', 'Managed API or local serving by constraints'],
    stack: ['Document pipeline', 'Embedding model', 'Vector store', 'LLM provider or local runtime', 'Observability/evals'],
    patterns: ['Chunking', 'Vector search', 'Context memory', 'Structured outputs', 'Model deployment'],
    implementation: ['Eval set', 'Chunking strategy', 'Retrieval contract', 'Prompt/version policy', 'Fallback behavior'],
    deliverables: ['RAG flow diagram', 'Eval rubric', 'Cost/latency sheet', 'Privacy decision record'],
    problemRefs: ['AI / LLM Systems', 'Vector Search / Embeddings', 'LLM Memory / Context Systems', 'AI / App Deployment & Serving', 'Search / Retrieval'],
  },
  {
    domain: 'ML Platform',
    workloads: ['Training', 'Feature pipelines', 'Inference', 'Monitoring', 'Experimentation'],
    architecture: ['Separate training and serving concerns', 'Version data/features/models together', 'Use managed services unless control is required'],
    stack: ['Feature store', 'Training orchestration', 'Model registry', 'Inference service', 'Monitoring'],
    patterns: ['Prediction', 'Batch pipelines', 'Model adaptation', 'Deployment/serving', 'Observability'],
    implementation: ['Training pipeline', 'Model registry policy', 'Online/offline feature parity', 'Drift monitoring'],
    deliverables: ['ML lifecycle diagram', 'Evaluation report', 'Deployment checklist', 'Rollback plan'],
    problemRefs: ['Machine Learning / AI', 'Batch / ETL Processing', 'Model Adaptation', 'AI / App Deployment & Serving', 'Observability'],
  },
];

function textFor(node: ProblemNode) {
  return [
    node.problem,
    node.description,
    node.scopeLevel,
    node.impactLevel,
    node.firstMove,
    ...(node.tags || []),
    ...(node.examples || []),
    ...(node.bestFor || []),
    ...(node.tradeoffs || []),
    ...(node.patterns || []).flatMap((pattern) => [
      pattern.name,
      ...(pattern.solutions || []).flatMap((solution) => [
        solution.name,
        solution.tool,
        solution.blurb || '',
        solution.implementationNote || '',
      ]),
    ]),
  ].join(' ').toLowerCase();
}

function scoreProblem(node: ProblemNode, track: PlatformTrack, goal?: ZoomOption, workload?: string) {
  const text = textFor(node);
  let score = 0;
  if (track.problemRefs.includes(node.problem)) score += 12;
  for (const term of goal?.terms || []) {
    if (text.includes(term.toLowerCase())) score += 2;
  }
  if (workload && text.includes(workload.toLowerCase())) score += 3;
  for (const term of [...track.workloads, ...track.patterns, ...track.stack]) {
    if (text.includes(term.toLowerCase())) score += 1;
  }
  if (node.impactLevel === 'core') score += 2;
  if (node.impactLevel === 'common') score += 1;
  if (node.impactLevel === 'archival') score -= 4;
  return score;
}

function renderList(items: string[]) {
  return (
    <ul>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export default function ZoomMode({ data, onFocus }: { data: ProblemNode[]; onFocus: (problem: string) => void }) {
  const [goal, setGoal] = useState(goals[0].label);
  const [domain, setDomain] = useState(tracks[0].domain);
  const selectedTrack = tracks.find((track) => track.domain === domain) || tracks[0];
  const [workload, setWorkload] = useState(selectedTrack.workloads[0]);

  const selectedGoal = goals.find((candidate) => candidate.label === goal);
  const normalizedWorkload = selectedTrack.workloads.includes(workload) ? workload : selectedTrack.workloads[0];

  const recommendations = useMemo(() => data
    .map((node) => ({ node, score: scoreProblem(node, selectedTrack, selectedGoal, normalizedWorkload) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.node.problem.localeCompare(b.node.problem))
    .slice(0, 5), [data, normalizedWorkload, selectedGoal, selectedTrack]);

  const selectDomain = (value: string) => {
    const nextTrack = tracks.find((track) => track.domain === value) || tracks[0];
    setDomain(value);
    setWorkload(nextTrack.workloads[0]);
  };

  return (
    <section className="zoom-mode card">
      <div className="zoom-header">
        <div>
          <h2>Zoom Mode</h2>
          <p>Fly from business goal to platform shape, architecture, stack, implementation, and deliverables.</p>
        </div>
      </div>

      <div className="zoom-controls">
        <fieldset className="wizard-question">
          <legend>Business goal</legend>
          <div className="segmented">
            {goals.map((option) => (
              <button
                className={`segment ${goal === option.label ? 'active' : ''}`}
                key={option.label}
                type="button"
                onClick={() => setGoal(option.label)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="wizard-question">
          <legend>Platform type</legend>
          <div className="segmented">
            {tracks.map((track) => (
              <button
                className={`segment ${domain === track.domain ? 'active' : ''}`}
                key={track.domain}
                type="button"
                onClick={() => selectDomain(track.domain)}
              >
                {track.domain}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="wizard-question">
          <legend>Primary workload</legend>
          <div className="segmented">
            {selectedTrack.workloads.map((item) => (
              <button
                className={`segment ${normalizedWorkload === item ? 'active' : ''}`}
                key={item}
                type="button"
                onClick={() => setWorkload(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="zoom-rail" aria-label="Zoom levels">
        <article>
          <span>01</span>
          <strong>Business</strong>
          <p>{goal}</p>
        </article>
        <article>
          <span>02</span>
          <strong>Platform</strong>
          <p>{selectedTrack.domain}</p>
        </article>
        <article>
          <span>03</span>
          <strong>Workload</strong>
          <p>{normalizedWorkload}</p>
        </article>
        <article>
          <span>04</span>
          <strong>Architecture</strong>
          {renderList(selectedTrack.architecture)}
        </article>
        <article>
          <span>05</span>
          <strong>Stack</strong>
          {renderList(selectedTrack.stack)}
        </article>
        <article>
          <span>06</span>
          <strong>Patterns</strong>
          {renderList(selectedTrack.patterns)}
        </article>
        <article>
          <span>07</span>
          <strong>Implementation</strong>
          {renderList(selectedTrack.implementation)}
        </article>
        <article>
          <span>08</span>
          <strong>Deliverables</strong>
          {renderList(selectedTrack.deliverables)}
        </article>
      </div>

      <div className="zoom-recommendations">
        <strong>Relevant catalog areas</strong>
        <div className="zoom-recommendation-grid">
          {recommendations.map(({ node }) => (
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
