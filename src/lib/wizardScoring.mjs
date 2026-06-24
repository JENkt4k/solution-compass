export const questions = [
  {
    id: 'domain',
    prompt: 'What kind of problem are you solving?',
    options: [
      option('Data or records', ['data', 'database', 'crud', 'etl', 'batch', 'pipeline', 'records'], {
        boost: { 'CRUD & Data Modeling': 8, 'Batch / ETL Processing': 7, 'Search / Retrieval': 3 },
      }),
      option('Search or discovery', ['search', 'retrieval', 'ranking', 'filter', 'graph traversal', 'pathfinding'], {
        boost: { 'Search / Retrieval': 9, 'Vector Search / Embeddings': 7, 'Graph Algorithms & Graph Data': 5 },
      }),
      option('Optimization or planning', ['optimization', 'scheduling', 'constraints', 'linear', 'integer', 'flow'], {
        boost: {
          'Scheduling / Optimization': 9,
          'Linear/Integer Programming': 8,
          'Constraint Solving': 7,
          'Network flow': 6,
        },
        suppress: { 'AI / LLM Systems': 3, 'Generative Media': 5 },
      }),
      option('Coordination or workflow', ['concurrency', 'coordination', 'workflow', 'state machine', 'consensus', 'messaging'], {
        boost: {
          'Workflow / State Modeling': 9,
          'Messaging / Coordination': 7,
          'Concurrency / Parallelism': 6,
          'Distributed consensus': 5,
        },
      }),
      option('Security or identity', ['security', 'auth', 'crypto', 'hashing', 'encryption'], {
        boost: { 'Security & Cryptography': 12 },
        suppress: { 'Generative Media': 4, 'Vision / World Representation Models': 4 },
      }),
      option('Prediction or recognition', ['machine learning', 'classification', 'prediction', 'clustering', 'NLP'], {
        boost: {
          'Machine Learning / AI': 18,
          'Vision / World Representation Models': 8,
          'Model Adaptation': 3,
        },
        suppress: {
          'AI / App Deployment & Serving': 6,
          'Generative Media': 4,
        },
      }),
      option('LLM, agents, or RAG', ['AI', 'LLM', 'language model', 'RAG', 'agents', 'tools', 'structured outputs'], {
        boost: {
          'AI / LLM Systems': 12,
          'Vector Search / Embeddings': 7,
          'LLM Memory / Context Systems': 6,
          'Model Adaptation': 4,
        },
      }),
      option('Generative media', ['diffusion', 'Stable Diffusion', 'image generation', 'generative media', 'ControlNet'], {
        boost: { 'Generative Media': 12, 'Model Adaptation': 4 },
        suppress: { 'Linear/Integer Programming': 4, 'CRUD & Data Modeling': 4 },
      }),
      option('AI deployment or locality', ['model serving', 'managed model API', 'self-hosted inference', 'local LLM', 'edge', 'deployment', 'serving'], {
        boost: {
          'AI / App Deployment & Serving': 12,
          'LLM Memory / Context Systems': 5,
          'Model Adaptation': 4,
        },
      }),
      option('System architecture', ['architecture', 'system design', 'microservices', 'event-driven architecture', 'CQRS', 'SLO', 'idempotency', 'backpressure'], {
        boost: {
          'System Architecture Patterns': 14,
          'Stream / Event Processing': 5,
          'Messaging / Coordination': 5,
          'Observability': 4,
        },
      }),
      option('Runtime, compiler, or hardware', ['runtime', 'compiler', 'hardware', 'SIMD', 'CUDA', 'ROCm', 'x86', 'ARM', 'WASM', 'JIT', 'AOT'], {
        boost: {
          'Runtime / Compiler Choices': 12,
          'Performance / Hardware Acceleration': 12,
        },
        suppress: {
          'AI / LLM Systems': 3,
          'CRUD & Data Modeling': 3,
        },
      }),
    ],
  },
  {
    id: 'timing',
    prompt: 'How does the work happen?',
    options: [
      option('Real-time or event-driven', ['real-time', 'stream', 'events', 'event-driven', 'async'], {
        boost: { 'Stream / Event Processing': 10, 'Messaging / Coordination': 5, 'Caching': 3 },
      }),
      option('Scheduled or batch', ['batch', 'ETL', 'scheduled jobs', 'reporting'], {
        boost: { 'Batch / ETL Processing': 10, 'Functional pipelines': 4 },
        suppress: { 'Stream / Event Processing': 3 },
      }),
      option('Interactive request/response', ['latency', 'cache', 'crud', 'search', 'database'], {
        boost: { Caching: 6, 'Search / Retrieval': 5, 'CRUD & Data Modeling': 5 },
      }),
      option('Long-running process', ['workflow', 'approval', 'state transitions', 'durable'], {
        boost: { 'Workflow / State Modeling': 10, 'Messaging / Coordination': 4 },
      }),
      option('Model inference or generation', ['LLM', 'inference', 'generation', 'model serving', 'diffusion', 'local model', 'managed model API'], {
        boost: { 'AI / App Deployment & Serving': 8, 'AI / LLM Systems': 7, 'Generative Media': 6 },
      }),
    ],
  },
  {
    id: 'answer',
    prompt: 'What kind of answer do you need?',
    options: [
      option('Exact optimum', ['optimization', 'linear', 'integer', 'network flow', 'dynamic programming', 'constraint'], {
        boost: {
          'Linear/Integer Programming': 10,
          'Dynamic Programming': 8,
          'Network flow': 8,
          'Constraint Solving': 7,
          'Scheduling / Optimization': 6,
        },
        suppress: {
          'AI / LLM Systems': 7,
          'Generative Media': 7,
          'Vector Search / Embeddings': 5,
          'LLM Memory / Context Systems': 5,
          'Heuristic search': 3,
        },
      }),
      option('Good enough quickly', ['heuristic', 'greedy', 'cache', 'approximate', 'beam search'], {
        boost: { 'Heuristic search': 8, 'Greedy Algorithms': 8, Caching: 5, 'State-space search': 4 },
        suppress: { 'Formal Verification': 4, 'Formal methods & model checking': 4 },
      }),
      option('Ranked or relevant results', ['ranking', 'relevance', 'search', 'retrieval'], {
        boost: { 'Search / Retrieval': 10, 'Vector Search / Embeddings': 8, 'AI / LLM Systems': 4 },
      }),
      option('Prediction or classification', ['classification', 'prediction', 'regression', 'clustering', 'machine learning'], {
        boost: { 'Machine Learning / AI': 12, 'Vision / World Representation Models': 5, 'Model Adaptation': 4 },
        suppress: { 'AI / App Deployment & Serving': 5, 'Generative Media': 4 },
      }),
      option('Valid configuration', ['constraints', 'CSP', 'SAT', 'valid configurations'], {
        boost: { 'Constraint Solving': 11, 'Logic programming': 5, 'Linear/Integer Programming': 4 },
      }),
      option('Proof or high confidence', ['formal', 'verification', 'model checking', 'correctness'], {
        boost: { 'Formal Verification': 10, 'Formal methods & model checking': 10, 'Security & Cryptography': 4 },
        suppress: { 'AI / LLM Systems': 5, 'Generative Media': 5 },
      }),
      option('Generated text, image, or action', ['LLM', 'agent', 'structured outputs', 'diffusion', 'image generation', 'tool-use'], {
        boost: { 'AI / LLM Systems': 9, 'Generative Media': 8, 'AI / App Deployment & Serving': 4 },
      }),
    ],
  },
  {
    id: 'shape',
    prompt: 'What shape does the problem have?',
    options: [
      option('Relationships or paths', ['graph', 'relationships', 'traversal', 'shortest path', 'flow'], {
        boost: { 'Graph Algorithms & Graph Data': 10, 'Network flow': 7, 'State-space search': 5 },
      }),
      option('Rules and constraints', ['rules', 'logic', 'constraints', 'declarative'], {
        boost: { 'Constraint Solving': 9, 'Logic programming': 7, 'Formal Verification': 4 },
      }),
      option('States and transitions', ['state', 'state machine', 'workflow', 'FSM', 'Petri'], {
        boost: { 'Workflow / State Modeling': 9, 'State-space search': 7, 'Formal methods & model checking': 4 },
      }),
      option('Text, documents, or records', ['text', 'documents', 'records', 'search', 'database'], {
        boost: { 'Search / Retrieval': 8, 'CRUD & Data Modeling': 6, 'AI / LLM Systems': 5 },
      }),
      option('Embeddings or memory', ['embeddings', 'vector', 'LLM memory', 'semantic search', 'RAG', 'context'], {
        boost: { 'Vector Search / Embeddings': 12, 'LLM Memory / Context Systems': 10, 'AI / LLM Systems': 6 },
      }),
      option('Uncertainty or simulation', ['simulation', 'stochastic', 'Monte Carlo', 'queueing'], {
        boost: { 'Stochastic or discrete-event simulation': 12, 'Machine Learning / AI': 3 },
      }),
    ],
  },
  {
    id: 'scale',
    prompt: 'What scale are you aiming for?',
    options: [
      option('Small or local', ['low setup', 'local', 'pseudocode', 'in-memory', 'low'], {
        boost: { Caching: 4, 'Greedy Algorithms': 4, 'Dynamic Programming': 3 },
        suppress: { 'Distributed consensus': 5, 'AI / App Deployment & Serving': 3 },
      }),
      option('Production service', ['mature', 'service', 'database', 'monitoring', 'workflow'], {
        boost: { Observability: 7, 'CRUD & Data Modeling': 5, 'Search / Retrieval': 4, 'AI / App Deployment & Serving': 4 },
      }),
      option('Distributed system', ['distributed', 'consensus', 'stream', 'coordination', 'cluster'], {
        boost: { 'Distributed consensus': 9, 'Stream / Event Processing': 7, 'Messaging / Coordination': 6, 'System Architecture Patterns': 5 },
      }),
      option('Large dataset', ['large', 'warehouse', 'index', 'documents', 'data lake'], {
        boost: { 'Batch / ETL Processing': 8, 'Search / Retrieval': 6, 'Vector Search / Embeddings': 6 },
      }),
      option('Local model or edge', ['local', 'local LLM', 'edge', 'self-hosted inference', 'self-hosted', 'model serving'], {
        boost: { 'AI / App Deployment & Serving': 10, 'LLM Memory / Context Systems': 6, 'Model Adaptation': 5 },
      }),
      option('Hardware-specific target', ['hardware', 'GPU', 'CPU', 'SIMD', 'CUDA', 'ROCm', 'x86', 'ARM', 'edge'], {
        boost: { 'Performance / Hardware Acceleration': 12, 'Runtime / Compiler Choices': 5 },
      }),
    ],
  },
  {
    id: 'risk',
    prompt: 'What risk matters most?',
    options: [
      option('Low setup cost', ['low setup', 'simple', 'low', 'greedy', 'cache'], {
        boost: { Caching: 6, 'Greedy Algorithms': 5, 'CRUD & Data Modeling': 3 },
        suppress: { 'Linear/Integer Programming': 3, 'Formal methods & model checking': 3 },
      }),
      option('Correctness', ['correctness', 'formal', 'exact', 'transactions', 'constraints'], {
        boost: { 'Formal Verification': 8, 'Constraint Solving': 6, 'CRUD & Data Modeling': 4, 'Security & Cryptography': 4 },
        suppress: { 'AI / LLM Systems': 5, 'Generative Media': 5 },
      }),
      option('Operational maturity', ['mature', 'observability', 'monitoring', 'managed', 'standard'], {
        boost: { Observability: 8, 'AI / App Deployment & Serving': 5, 'Search / Retrieval': 4 },
      }),
      option('Speed or latency', ['latency', 'cache', 'real-time', 'search', 'heuristic'], {
        boost: { Caching: 9, 'Search / Retrieval': 5, 'Stream / Event Processing': 4, 'Heuristic search': 4, 'Performance / Hardware Acceleration': 4 },
      }),
      option('Privacy or control', ['local', 'self-hosted inference', 'self-hosted', 'privacy', 'local LLM', 'controlled infrastructure'], {
        boost: { 'AI / App Deployment & Serving': 9, 'LLM Memory / Context Systems': 7, 'Security & Cryptography': 4 },
        suppress: { 'AI / LLM Systems': 2 },
      }),
    ],
  },
];

function option(label, terms, config = {}) {
  return {
    label,
    terms: terms.map((entry) => (typeof entry === 'string' ? { term: entry, weight: 2 } : entry)),
    boost: config.boost || {},
    suppress: config.suppress || {},
  };
}

function normalize(text) {
  return String(text || '').toLowerCase();
}

function searchableText(node) {
  const solutionText = (node.patterns || []).flatMap((pattern) => [
    pattern.name,
    ...(pattern.solutions || []).flatMap((solution) => [
      solution.name,
      solution.tool,
      solution.language,
      solution.blurb || '',
      solution.reuseLevel || '',
      solution.implementationNote || '',
      solution.timeComplexity || '',
      solution.spaceComplexity || '',
    ]),
  ]);

  return normalize([
    node.problem,
    node.scopeLevel || '',
    node.impactLevel || '',
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

export function scoreNode(node, selected) {
  const text = searchableText(node);
  const reasons = [];
  const penalties = [];
  let score = 0;

  for (const question of questions) {
    const selectedLabel = selected[question.id];
    const selectedOption = question.options.find((candidate) => candidate.label === selectedLabel);
    if (!selectedOption) continue;

    const matchedTerms = selectedOption.terms.filter(({ term }) => text.includes(normalize(term)));
    const termScore = matchedTerms.reduce((total, item) => total + item.weight, 0);
    if (termScore > 0) {
      score += termScore;
      reasons.push(`${selectedLabel}: ${matchedTerms.slice(0, 3).map((item) => item.term).join(', ')}`);
    }

    const boosted = selectedOption.boost[node.problem] || 0;
    if (boosted) {
      score += boosted;
      reasons.push(`Strong scenario fit for ${selectedLabel}`);
    }

    const suppressed = selectedOption.suppress[node.problem] || 0;
    if (suppressed) {
      score -= suppressed;
      penalties.push(`Less suitable for ${selectedLabel}`);
    }
  }

  if (node.setupCost === 'Low' && Object.values(selected).includes('Low setup cost')) {
    score += 3;
    reasons.push('Low setup cost matches your risk preference');
  }
  if (node.complexity === 'High' && Object.values(selected).includes('Small or local')) {
    score -= 2;
    penalties.push('Higher complexity than a small/local preference');
  }
  if (node.maturity === 'Specialized' && !Object.values(selected).includes('Proof or high confidence')) {
    score -= 1;
  }

  return { score, reasons: dedupe(reasons), penalties: dedupe(penalties) };
}

export function getRecommendations(data, selected, limit = 5) {
  if (!Object.keys(selected).length) return [];

  return data
    .map((node) => {
      const result = scoreNode(node, selected);
      return { node, score: result.score, reasons: result.reasons, penalties: result.penalties };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.node.problem.localeCompare(b.node.problem))
    .slice(0, limit);
}

function dedupe(items) {
  return [...new Set(items)];
}
