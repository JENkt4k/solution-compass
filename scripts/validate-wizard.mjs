import fs from 'node:fs';
import { getRecommendations } from '../src/lib/wizardScoring.mjs';

const DATA_PATH = new URL('../public/complete-tree-data.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const scenarios = [
  {
    name: 'AI/RAG',
    answers: {
      domain: 'LLM, agents, or RAG',
      answer: 'Ranked or relevant results',
      shape: 'Text, documents, or records',
    },
    expectedTop: ['AI / LLM Systems', 'Vector Search / Embeddings', 'LLM Memory / Context Systems'],
  },
  {
    name: 'Vector memory',
    answers: {
      domain: 'LLM, agents, or RAG',
      shape: 'Embeddings or memory',
      risk: 'Privacy or control',
    },
    expectedTop: ['Vector Search / Embeddings', 'LLM Memory / Context Systems', 'AI / LLM Systems'],
  },
  {
    name: 'AI deployment/locality',
    answers: {
      domain: 'AI deployment or locality',
      timing: 'Model inference or generation',
      scale: 'Local model or edge',
      risk: 'Privacy or control',
    },
    expectedTop: ['AI / App Deployment & Serving', 'LLM Memory / Context Systems', 'Model Adaptation'],
  },
  {
    name: 'ETL/ELT',
    answers: {
      domain: 'Data or records',
      timing: 'Scheduled or batch',
      shape: 'Text, documents, or records',
      scale: 'Large dataset',
    },
    expectedTop: ['Batch / ETL Processing', 'CRUD & Data Modeling', 'Search / Retrieval'],
  },
  {
    name: 'Graph search',
    answers: {
      domain: 'Search or discovery',
      answer: 'Good enough quickly',
      shape: 'Relationships or paths',
    },
    expectedTop: ['Graph Algorithms & Graph Data', 'State-space search', 'Heuristic search'],
  },
  {
    name: 'Optimization/constraints',
    answers: {
      domain: 'Optimization or planning',
      answer: 'Exact optimum',
      shape: 'Rules and constraints',
      risk: 'Correctness',
    },
    expectedTop: ['Constraint Solving', 'Linear/Integer Programming', 'Scheduling / Optimization', 'Dynamic Programming'],
  },
  {
    name: 'Security/auth',
    answers: {
      domain: 'Security or identity',
      answer: 'Proof or high confidence',
      risk: 'Correctness',
    },
    expectedTop: ['Security & Cryptography', 'Formal Verification', 'Formal methods & model checking'],
  },
  {
    name: 'Prediction/recognition',
    answers: {
      domain: 'Prediction or recognition',
      timing: 'Model inference or generation',
      answer: 'Prediction or classification',
    },
    expectedTop: ['Machine Learning / AI', 'AI / LLM Systems', 'Vision / World Representation Models'],
  },
  {
    name: 'System architecture',
    answers: {
      domain: 'System architecture',
      scale: 'Distributed system',
      risk: 'Operational maturity',
    },
    expectedTop: ['System Architecture Patterns', 'Observability', 'Messaging / Coordination'],
  },
  {
    name: 'Hardware/runtime performance',
    answers: {
      domain: 'Runtime, compiler, or hardware',
      scale: 'Hardware-specific target',
      risk: 'Speed or latency',
    },
    expectedTop: ['Performance / Hardware Acceleration', 'Runtime / Compiler Choices'],
  },
];

const errors = [];

for (const scenario of scenarios) {
  const recommendations = getRecommendations(data, scenario.answers, 5);
  const top = recommendations.slice(0, 3).map((item) => item.node.problem);
  const matched = top.some((problem) => scenario.expectedTop.includes(problem));

  console.log(`${scenario.name}: ${top.join(' | ')}`);

  if (!matched) {
    errors.push(`${scenario.name}: expected one of [${scenario.expectedTop.join(', ')}] in top 3`);
  }
}

if (errors.length) {
  for (const error of errors) {
    console.error(`Error: ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${scenarios.length} wizard scenarios.`);
