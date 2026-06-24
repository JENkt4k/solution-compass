import fs from 'node:fs';

const DATA_PATH = new URL('../public/complete-tree-data.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const errors = [];
const warnings = [];
const scopeLevels = new Set(['architecture', 'stack', 'runtime', 'library', 'language', 'algorithm', 'hardware']);

function label(problem, pattern, solution) {
  const parts = [problem?.problem, pattern?.name, solution?.name].filter(Boolean);
  return parts.join(' > ');
}

function requireString(value, field, context) {
  if (typeof value !== 'string' || !value.trim()) {
    errors.push(`${context}: missing ${field}`);
  }
}

function requireStringArray(value, field, context) {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== 'string' || !item.trim())) {
    errors.push(`${context}: ${field} must contain one or more strings`);
  }
}

function checkUrl(value, context) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      errors.push(`${context}: url must use http or https`);
    }
  } catch {
    errors.push(`${context}: invalid url "${value}"`);
  }
}

if (!Array.isArray(data)) {
  errors.push('Dataset must be a top-level array');
} else {
  const problemNames = new Set();

  for (const problem of data) {
    const problemContext = problem?.problem || '<unknown problem>';
    requireString(problem?.problem, 'problem', problemContext);

    if (problemNames.has(problem.problem)) {
      errors.push(`${problemContext}: duplicate problem name`);
    }
    problemNames.add(problem.problem);

    if (!Array.isArray(problem.tags) || problem.tags.length === 0) {
      warnings.push(`${problemContext}: no tags`);
    }

    requireStringArray(problem.bestFor, 'bestFor', problemContext);
    requireStringArray(problem.avoidWhen, 'avoidWhen', problemContext);
    requireStringArray(problem.tradeoffs, 'tradeoffs', problemContext);
    requireString(problem.scopeLevel, 'scopeLevel', problemContext);
    requireString(problem.complexity, 'complexity', problemContext);
    requireString(problem.maturity, 'maturity', problemContext);
    requireString(problem.scale, 'scale', problemContext);
    requireString(problem.setupCost, 'setupCost', problemContext);

    if (problem.scopeLevel && !scopeLevels.has(problem.scopeLevel)) {
      errors.push(`${problemContext}: invalid scopeLevel "${problem.scopeLevel}"`);
    }

    if (!Array.isArray(problem.patterns) || problem.patterns.length === 0) {
      errors.push(`${problemContext}: no patterns`);
      continue;
    }

    const patternNames = new Set();
    for (const pattern of problem.patterns) {
      const patternContext = label(problem, pattern);
      requireString(pattern?.name, 'pattern.name', patternContext);

      if (patternNames.has(pattern.name)) {
        warnings.push(`${problemContext}: duplicate pattern "${pattern.name}"`);
      }
      patternNames.add(pattern.name);

      if (!Array.isArray(pattern.solutions) || pattern.solutions.length === 0) {
        errors.push(`${patternContext}: no solutions`);
        continue;
      }

      const solutionNames = new Set();
      for (const solution of pattern.solutions) {
        const solutionContext = label(problem, pattern, solution);
        requireString(solution?.name, 'solution.name', solutionContext);
        requireString(solution?.tool, 'solution.tool', solutionContext);
        requireString(solution?.language, 'solution.language', solutionContext);
        requireString(solution?.blurb, 'solution.blurb', solutionContext);
        requireString(solution?.url, 'solution.url', solutionContext);

        if (solution.tool === 'Example') {
          errors.push(`${solutionContext}: generic tool "Example"`);
        }

        if (solution.code) {
          requireString(solution.timeComplexity, 'solution.timeComplexity', solutionContext);
          requireString(solution.spaceComplexity, 'solution.spaceComplexity', solutionContext);
        }

        if (solution.url) {
          checkUrl(solution.url, solutionContext);
        }

        const duplicateKey = `${solution.name}|${solution.tool}|${solution.language}`.toLowerCase();
        if (solutionNames.has(duplicateKey)) {
          warnings.push(`${patternContext}: duplicate solution "${solution.name}"`);
        }
        solutionNames.add(duplicateKey);
      }
    }
  }
}

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}

if (errors.length) {
  for (const error of errors) {
    console.error(`Error: ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${data.length} problem nodes with ${warnings.length} warning(s).`);
