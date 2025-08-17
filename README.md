# SolutionCompass

*A lightweight, offline-capable decision support system that helps you navigate from **Problem → Pattern → Tool/Algorithm**, with examples and code snippets. Built as a static PWA and ready to deploy on GitHub Pages.*

---

## Demo / Status

- **Status:** MVP complete ✅
  - Static PWA (installable, offline)
  - Card/grid view of problems → patterns → solutions
  - Global **search** (problems, subcategories, tags, descriptions, patterns, solutions)
  - **Expand/Collapse** all + per-card collapsibles
  - **Code snippets** for common algorithms (e.g., A*, BFS, Dijkstra, Huffman, Knapsack, Network Flow)
  - Dataset stored at `public/complete-tree-data.json`
- **Planned:** interactive Q&A wizard for guided decisions; dataset editor in-browser

> When hosted on GitHub Pages, your site will be available at: `https://<YOUR_GH_USERNAME>.github.io/<REPO_NAME>/`

---

## Features

| Area | Details |
|---|---|
| **Decision Map** | Problem → Pattern → Solution hierarchy, with tags, subcategory, description, and examples |
| **Search** | Full-text filtering across titles, tags, examples, pattern names, solution names, tools, languages, descriptions |
| **UI/UX** | Dark, modern card layout; expand/collapse; highlight matches; responsive grid |
| **PWA** | Installable, offline caching with auto-update (via `vite-plugin-pwa`) |
| **Data** | Human-editable JSON in `public/complete-tree-data.json` |
| **Algorithms** | Built-in snippets: A*, BFS, Dijkstra, Huffman, 0/1 Knapsack, Edmonds–Karp, Dinic, plus library samples (NetworkX, OR-Tools) |
| **Deploy** | 1-click GitHub Pages (`gh-pages` script) or GitHub Actions workflow |

---

## Screenshots

> _Add screenshots to `docs/` and link here once deployed._

---

## Data Model

TypeScript types (found in `src/hooks/useTreeData.ts`):

```ts
export interface Solution {
  name: string;
  tool: string;       // "Algorithm" | "Library" | Framework name, etc.
  language: string;   // e.g., "Python", "C++", "Any"
  blurb?: string;     // optional one-liner
  code?: string;      // optional code snippet for the solution
  url?: string;       // optional reference link
}

export interface Pattern {
  name: string;       // e.g., "Overview", "Event Streaming", "Classic DP problems"
  solutions: Solution[];
}

export interface ProblemNode {
  problem: string;    // primary key used for dedupe/merge
  tags: string[];
  subcategory?: string;
  description?: string;
  examples?: string[];
  patterns: Pattern[];
}
```

**Dataset Location:** `public/complete-tree-data.json`  
_Edit this file to add new problems, patterns, or solutions. The app hot-reloads in dev._

---

## Getting Started

```bash
# 1) Install
npm install

# 2) Local development
npm run dev
# open http://localhost:5173

# 3) Preview production build
npm run build
npm run serve
```

> **Vite base path:** The project auto-switches base path for GH Pages.  
> - **Dev**: `/`  
> - **Build/Deploy**: `/${REPO_NAME}/` (set in `vite.config.ts`: `const REPO_NAME = 'solution-compass'`)

**PWA manifest** is configured with `start_url: "."` and `scope: "."` to work at the repo subpath.

---

## Deploying to GitHub Pages

**Option A: Use `gh-pages` npm script**

```bash
npm run build
npm run deploy  # pushes dist/ to gh-pages branch
```

Then in GitHub:
- **Settings → Pages → Source**: `Deploy from a branch`
- **Branch**: `gh-pages` / root

**Option B: GitHub Actions**  
Create `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## Current Status & Known Issues

- ✅ **Data deduping/merge**: duplicate problem names are merged; patterns and solutions are unioned.
- ✅ **Gradient artifact**: fixed by moving/fading the right radial gradient off-canvas.
- ⚠️ **Partial examples**: some taxonomy items still show placeholder rows without `code` or `url`. This is being filled in incrementally.
- ⚠️ **No routing/deeplinks yet**: direct links to specific nodes aren’t implemented (planned).

---

## Roadmap

**Short-term**
- [ ] Q&A **Wizard Mode** (guided prompts → problem type scoring → recommended solution sets)
- [ ] **Tag chips** (clickable category filters; AND/OR modes)
- [ ] **Deep links** to nodes (`/#/node/<slug>`) + expand state in URL
- [ ] **Compact table view** toggle (grid ↔ table)
- [ ] More code snippets: Greedy MST (Kruskal/Prim), Activity Selection; DP LCS/Edit Distance; LP/IP modeling examples
- [ ] **Reference links** on every algorithm/tool entry
- [ ] In-app **copy link** / **copy code** buttons

**Medium-term**
- [ ] **Editable dataset** UI (local-only, IndexedDB; export/import JSON)
- [ ] **Contributions via PR** (schema validation + GitHub workflow)
- [ ] **Graph view** (D3/force or tree) with pan/zoom
- [ ] **Keyboard nav** + a11y improvements (ARIA, focus order)
- [ ] **Theme** switch (dark/light) + custom accent color
- [ ] **Search index** (Fuse.js/Lunr) for faster large datasets

**Long-term**
- [ ] **Reasoning/rules engine** for recommendations (weights, constraints, trade-offs)
- [ ] **Integration examples** (OR-Tools models, NetworkX demos, SQL/ORM patterns)
- [ ] **Pluggable sources** (load datasets from URL/Gist)
- [ ] **Multi-user** editorial mode with moderation

---

## Contributing

1. Fork and create a feature branch: `git checkout -b feat/my-change`
2. Edit `public/complete-tree-data.json` (or UI files in `src/`)
3. Commit and push: `git commit -m "feat: add XYZ"` then `git push`
4. Open a PR

> Please keep code snippets short, idiomatic, and language-tagged. Add a `url` reference when possible.

---

## License

MIT © You and contributors

---

## Acknowledgments

- Built with **React + Vite**, PWA via **vite-plugin-pwa**
- Algorithms inspired by classic texts (CLRS, Dasgupta–Papadimitriou–Vazirani) and community resources
