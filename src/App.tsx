import React, { useMemo, useState } from 'react';
import TreeCanvas from './components/TreeCanvas';
import SearchBar from './components/SearchBar';
import { InstallPrompt } from './components/InstallPrompt';
import { useTreeData, ProblemNode } from './hooks/useTreeData';

function App() {
  const { data, loading, error } = useTreeData();
  const [query, setQuery] = useState('');
  const [expandedAllVersion, setExpandedAllVersion] = useState(0); // changes to trigger expand all
  const [collapsedAllVersion, setCollapsedAllVersion] = useState(0); // changes to trigger collapse all

  const filtered: ProblemNode[] = useMemo(() => {
    if (!query.trim()) return data;
    const q = query.toLowerCase();

    const matches = (text?: string) => (text || '').toLowerCase().includes(q);
    const matchesArr = (arr?: string[]) => (arr || []).some((t) => matches(t));

    // filter problems, and within them filter patterns/solutions
    return data.map((p) => {
      const problemMatches = matches(p.problem) || matches(p.subcategory) || matchesArr(p.tags) || matchesArr(p.examples);
      const patterns = (p.patterns || []).map((pt) => {
        const patternMatches = matches(pt.name);
        const solutions = (pt.solutions || []).filter((s) => matches(s.name) || matches(s.tool) || matches(s.language));
        return { ...pt, solutions, __visible: patternMatches || solutions.length > 0 };
      }).filter((pt) => pt.__visible);

      const visible = problemMatches || patterns.length > 0;
      return visible ? { ...p, patterns } : null;
    }).filter(Boolean) as ProblemNode[];
  }, [data, query]);

  return (
    <div className="app-shell">
      <header className="topbar card">
        <div className="brand">
          <div className="logo">∴</div>
          <div className="titles">
            <h1>SolutionCompass</h1>
            <p className="subtitle">Problem → Pattern → Tool</p>
          </div>
        </div>
        <div className="actions">
          <SearchBar value={query} onChange={setQuery} placeholder="Search problems, patterns, tools, tags…" />
          <button className="btn" onClick={() => setExpandedAllVersion(v => v + 1)} title="Expand all">Expand all</button>
          <button className="btn secondary" onClick={() => setCollapsedAllVersion(v => v + 1)} title="Collapse all">Collapse all</button>
        </div>
      </header>
      <main className="content">
        <InstallPrompt />
        {loading && <div className="card">Loading…</div>}
        {error && <div className="card error">Error: {error}</div>}
        {!loading && !error && (
          <TreeCanvas
            data={filtered}
            expandAllVersion={expandedAllVersion}
            collapseAllVersion={collapsedAllVersion}
            query={query}
          />
        )}
      </main>
      <footer className="footer">
        <span>Static PWA • Offline-ready</span>
      </footer>
    </div>
  );
}

export default App;