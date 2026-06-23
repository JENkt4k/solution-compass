import React, { useMemo, useState } from 'react';
import { ProblemNode } from '../hooks/useTreeData';

type WizardOption = {
  label: string;
  tags: string[];
};

type WizardQuestion = {
  id: string;
  prompt: string;
  options: WizardOption[];
};

type Recommendation = {
  node: ProblemNode;
  score: number;
  reasons: string[];
};

const questions: WizardQuestion[] = [
  {
    id: 'domain',
    prompt: 'What kind of problem are you solving?',
    options: [
      { label: 'Data or records', tags: ['data', 'database', 'crud', 'etl', 'batch', 'pipeline', 'records'] },
      { label: 'Search or discovery', tags: ['search', 'retrieval', 'ranking', 'filter', 'graph traversal', 'pathfinding'] },
      { label: 'Optimization or planning', tags: ['optimization', 'scheduling', 'constraints', 'linear', 'integer', 'flow'] },
      { label: 'Coordination or workflow', tags: ['concurrency', 'coordination', 'workflow', 'state machine', 'consensus', 'messaging'] },
      { label: 'Security or identity', tags: ['security', 'auth', 'crypto', 'hashing', 'encryption'] },
      { label: 'Prediction or recognition', tags: ['machine learning', 'classification', 'prediction', 'clustering', 'NLP'] },
      { label: 'LLM, agents, or RAG', tags: ['AI', 'LLM', 'language model', 'RAG', 'agents', 'tools', 'structured outputs'] },
      { label: 'Generative media', tags: ['diffusion', 'Stable Diffusion', 'image generation', 'generative media', 'ControlNet'] },
      { label: 'AI deployment or locality', tags: ['model serving', 'managed model API', 'self-hosted inference', 'local LLM', 'edge', 'deployment', 'serving'] },
    ],
  },
  {
    id: 'timing',
    prompt: 'How does the work happen?',
    options: [
      { label: 'Real-time or event-driven', tags: ['real-time', 'stream', 'events', 'event-driven', 'async'] },
      { label: 'Scheduled or batch', tags: ['batch', 'ETL', 'scheduled jobs', 'reporting'] },
      { label: 'Interactive request/response', tags: ['latency', 'cache', 'crud', 'search', 'database'] },
      { label: 'Long-running process', tags: ['workflow', 'approval', 'state transitions', 'durable'] },
      { label: 'Model inference or generation', tags: ['LLM', 'inference', 'generation', 'model serving', 'diffusion', 'local model', 'managed model API'] },
    ],
  },
  {
    id: 'answer',
    prompt: 'What kind of answer do you need?',
    options: [
      { label: 'Exact optimum', tags: ['optimization', 'linear', 'integer', 'network flow', 'dynamic programming', 'constraint'] },
      { label: 'Good enough quickly', tags: ['heuristic', 'greedy', 'cache', 'approximate', 'beam search'] },
      { label: 'Ranked or relevant results', tags: ['ranking', 'relevance', 'search', 'retrieval'] },
      { label: 'Valid configuration', tags: ['constraints', 'CSP', 'SAT', 'valid configurations'] },
      { label: 'Proof or high confidence', tags: ['formal', 'verification', 'model checking', 'correctness'] },
      { label: 'Generated text, image, or action', tags: ['LLM', 'agent', 'structured outputs', 'diffusion', 'image generation', 'tool-use'] },
    ],
  },
  {
    id: 'shape',
    prompt: 'What shape does the problem have?',
    options: [
      { label: 'Relationships or paths', tags: ['graph', 'relationships', 'traversal', 'shortest path', 'flow'] },
      { label: 'Rules and constraints', tags: ['rules', 'logic', 'constraints', 'declarative'] },
      { label: 'States and transitions', tags: ['state', 'state machine', 'workflow', 'FSM', 'Petri'] },
      { label: 'Text, documents, or records', tags: ['text', 'documents', 'records', 'search', 'database'] },
      { label: 'Embeddings or memory', tags: ['embeddings', 'vector', 'LLM memory', 'semantic search', 'RAG', 'context'] },
      { label: 'Uncertainty or simulation', tags: ['simulation', 'stochastic', 'Monte Carlo', 'queueing'] },
    ],
  },
  {
    id: 'scale',
    prompt: 'What scale are you aiming for?',
    options: [
      { label: 'Small or local', tags: ['low setup', 'local', 'pseudocode', 'in-memory', 'low'] },
      { label: 'Production service', tags: ['mature', 'service', 'database', 'monitoring', 'workflow'] },
      { label: 'Distributed system', tags: ['distributed', 'consensus', 'stream', 'coordination', 'cluster'] },
      { label: 'Large dataset', tags: ['large', 'warehouse', 'index', 'documents', 'data lake'] },
      { label: 'Local model or edge', tags: ['local', 'local LLM', 'edge', 'self-hosted inference', 'self-hosted', 'model serving'] },
    ],
  },
  {
    id: 'risk',
    prompt: 'What risk matters most?',
    options: [
      { label: 'Low setup cost', tags: ['low setup', 'simple', 'low', 'greedy', 'cache'] },
      { label: 'Correctness', tags: ['correctness', 'formal', 'exact', 'transactions', 'constraints'] },
      { label: 'Operational maturity', tags: ['mature', 'observability', 'monitoring', 'managed', 'standard'] },
      { label: 'Speed or latency', tags: ['latency', 'cache', 'real-time', 'search', 'heuristic'] },
      { label: 'Privacy or control', tags: ['local', 'self-hosted inference', 'self-hosted', 'privacy', 'local LLM', 'controlled infrastructure'] },
    ],
  },
];

function normalize(text: string) {
  return text.toLowerCase();
}

function searchableText(node: ProblemNode) {
  const solutionText = node.patterns.flatMap((pattern) => [
    pattern.name,
    ...pattern.solutions.flatMap((solution) => [
      solution.name,
      solution.tool,
      solution.language,
      solution.blurb || '',
    ]),
  ]);

  return normalize([
    node.problem,
    node.subcategory || '',
    node.description || '',
    ...(node.tags || []),
    ...(node.examples || []),
    ...(node.bestFor || []),
    ...(node.avoidWhen || []),
    ...(node.tradeoffs || []),
    node.complexity || '',
    node.maturity || '',
    node.scale || '',
    node.setupCost || '',
    ...solutionText,
  ].join(' '));
}

function scoreNode(node: ProblemNode, selected: Record<string, string>) {
  const text = searchableText(node);
  const reasons: string[] = [];
  let score = 0;

  for (const question of questions) {
    const selectedLabel = selected[question.id];
    const option = question.options.find((candidate) => candidate.label === selectedLabel);
    if (!option) continue;

    const matchedTags = option.tags.filter((tag) => text.includes(normalize(tag)));
    if (matchedTags.length) {
      score += matchedTags.length * 2;
      reasons.push(`${question.prompt} ${selectedLabel} (${matchedTags.slice(0, 3).join(', ')})`);
    }
  }

  if (node.setupCost === 'Low' && Object.values(selected).includes('Low setup cost')) {
    score += 3;
  }
  if (node.complexity === 'High' && Object.values(selected).includes('Small or local')) {
    score -= 2;
  }
  if (node.maturity === 'Specialized' && !Object.values(selected).includes('Proof or high confidence')) {
    score -= 1;
  }

  return { score, reasons };
}

export default function Wizard({ data, onFocus }: { data: ProblemNode[]; onFocus: (query: string) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const recommendations = useMemo<Recommendation[]>(() => {
    const answered = Object.keys(answers).length;
    if (!answered) return [];

    return data
      .map((node) => {
        const result = scoreNode(node, answers);
        return { node, score: result.score, reasons: result.reasons };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.node.problem.localeCompare(b.node.problem))
      .slice(0, 5);
  }, [answers, data]);

  const reset = () => setAnswers({});

  return (
    <section className="wizard">
      <div className="wizard-header">
        <div>
          <h2>Decision Wizard</h2>
          <p>Answer a few prompts to get ranked problem areas with reasons and tradeoffs.</p>
        </div>
        <button className="btn secondary" type="button" onClick={reset}>Reset</button>
      </div>

      <div className="wizard-questions">
        {questions.map((question) => (
          <fieldset className="wizard-question" key={question.id}>
            <legend>{question.prompt}</legend>
            <div className="segmented">
              {question.options.map((option) => {
                const active = answers[question.id] === option.label;
                return (
                  <button
                    className={`segment ${active ? 'active' : ''}`}
                    type="button"
                    key={option.label}
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.label }))}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="recommendations">
        {recommendations.length === 0 ? (
          <div className="recommendation-empty">Choose one or more answers to rank matching problem areas.</div>
        ) : recommendations.map((item, index) => (
          <article className="recommendation" key={item.node.problem}>
            <div className="recommendation-topline">
              <span className="rank">#{index + 1}</span>
              <div>
                <h3>{item.node.problem}</h3>
                <p>{item.node.description}</p>
              </div>
              <button className="copy-btn" type="button" onClick={() => onFocus(item.node.problem)}>Focus</button>
            </div>
            <div className="decision-meta">
              <span>Complexity: {item.node.complexity}</span>
              <span>Setup: {item.node.setupCost}</span>
              <span>Maturity: {item.node.maturity}</span>
              <span>Scale: {item.node.scale}</span>
            </div>
            <div className="recommendation-detail">
              <div>
                <strong>Why it matched</strong>
                <ul>
                  {item.reasons.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}
                </ul>
              </div>
              <div>
                <strong>Tradeoffs</strong>
                <ul>
                  {(item.node.tradeoffs || []).slice(0, 2).map((tradeoff) => <li key={tradeoff}>{tradeoff}</li>)}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
