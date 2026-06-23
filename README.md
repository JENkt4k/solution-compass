# SolutionCompass

SolutionCompass is a lightweight, offline-capable decision support app for navigating from **Problem -> Pattern -> Tool/Algorithm**. It combines a searchable reference catalog with a guided wizard that recommends likely solution areas and explains why they matched.

## Status

MVP+ is functional and deployable on GitHub Pages.

- Static React/Vite PWA with install support and offline caching.
- Decision Wizard with answer-based scoring and recommendation explanations.
- Searchable catalog of problems, patterns, tools, algorithms, examples, snippets, and references.
- Normalized dataset with `26` problem areas, `49` patterns, and `139` solutions.
- Every solution has a short blurb and reference URL.
- Every problem area has decision metadata: best fit, avoid conditions, tradeoffs, complexity, maturity, scale, and setup cost.
- Dataset validation is available with `npm run validate:data`.

## Screenshots

![Desktop screenshot](docs/screenshots/desktop.png)

![Mobile screenshot](docs/screenshots/mobile.png)

## Features

| Area | Details |
|---|---|
| Decision Wizard | 6 guided prompts score the catalog and recommend 3-5 matching problem areas. |
| Result explanations | Recommendations show matched answers, fit metadata, and tradeoffs. |
| Decision map | Problem -> Pattern -> Solution hierarchy with tags, examples, references, and snippets. |
| Search | Full-text filtering across titles, tags, examples, decision metadata, patterns, solutions, tools, languages, blurbs, snippets, and URLs. |
| PWA | Installable, offline-ready static app via `vite-plugin-pwa`. |
| Data validation | Local script checks required fields, URLs, metadata, duplicate problem names, and placeholder tools. |
| Deploy | GitHub Pages compatible build path for `JENkt4k/solution-compass`. |

## Data Model

Dataset location: `public/complete-tree-data.json`

```ts
export interface Solution {
  name: string;
  tool: string;
  language: string;
  blurb?: string;
  code?: string;
  url?: string;
}

export interface Pattern {
  name: string;
  solutions: Solution[];
}

export interface ProblemNode {
  problem: string;
  tags: string[];
  subcategory?: string;
  description?: string;
  examples?: string[];
  bestFor?: string[];
  avoidWhen?: string[];
  tradeoffs?: string[];
  complexity?: string;
  maturity?: string;
  scale?: string;
  setupCost?: string;
  patterns: Pattern[];
}
```

## Development

```bash
npm install
npm run dev
```

Open the local Vite URL printed by the command.

## Validation

```bash
npm run validate:data
```

The validator fails on:

- Missing problem, pattern, or solution fields.
- Missing solution `blurb`, `url`, or `language`.
- Missing problem decision metadata.
- Invalid URLs.
- Generic `tool: "Example"` placeholders.
- Duplicate problem names.
- Empty pattern or solution lists.

## Build

```bash
npm run build
npm run serve
```

The Vite base path is `/` in dev and `/solution-compass/` in production for GitHub Pages.

## Deploying to GitHub Pages

```bash
npm run build
npm run deploy
```

Or use the existing GitHub Pages workflow in `.github/workflows/pages.yml`.

## Current Gaps

- Wizard scoring is transparent and useful, but still simple keyword/tag scoring rather than a full rules engine.
- Snippet coverage is selective: graph search, A*, knapsack, LCS, MST, CP-SAT, SQL CRUD, Redis cache, and network flow examples are covered, but many tools intentionally link to references instead of embedding code.
- No deep links to individual nodes yet.
- No compact table view yet.
- No editable dataset UI yet.

## Roadmap

Short term:

- Deep links to problem nodes and expanded state.
- Clickable tag chips with AND/OR filter modes.
- Compact table view for scanning all solutions.
- Copy-link buttons for problem nodes.
- More snippets for high-value algorithms and integration examples.

Medium term:

- Stronger wizard scoring with weighted rules and explicit constraints.
- Local editable dataset UI with JSON import/export.
- Contribution workflow that runs `npm run validate:data`.
- Graph/tree visualization mode.
- Accessibility pass for keyboard navigation and focus management.

Long term:

- Pluggable datasets from URL or Gist.
- Multi-user editorial workflow.
- Rules engine for recommendations with weights, constraints, and explainable tradeoffs.

## License

MIT
