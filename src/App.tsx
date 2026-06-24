import React, { useEffect, useMemo, useState } from 'react';
import TreeCanvas from './components/TreeCanvas';
import SearchBar from './components/SearchBar';
import { InstallPrompt } from './components/InstallPrompt';
import Wizard from './components/Wizard';
import CompareTable from './components/CompareTable';
import { useTreeData, ProblemNode } from './hooks/useTreeData';
import { slugify } from './utils/slug';

function problemSlugFromHash() {
  const match = window.location.hash.match(/^#\/problem\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : '';
}

function App() {
  const { data, loading, error } = useTreeData();
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [focusedProblemSlug, setFocusedProblemSlug] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'compare'>('tree');
  const [expandedAllVersion, setExpandedAllVersion] = useState(0);
  const [collapsedAllVersion, setCollapsedAllVersion] = useState(0);

  useEffect(() => {
    const syncHash = () => {
      const slug = problemSlugFromHash();
      setFocusedProblemSlug(slug);
      if (slug) {
        setActiveTag('');
        setExpandedAllVersion((v) => v + 1);
      }
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const focusedProblem = useMemo(
    () => data.find((problem) => slugify(problem.problem) === focusedProblemSlug),
    [data, focusedProblemSlug],
  );

  const filtered: ProblemNode[] = useMemo(() => {
    if (focusedProblem) return [focusedProblem];

    const tagFiltered = activeTag
      ? data.filter((p) => (p.tags || []).some((tag) => tag.toLowerCase() === activeTag.toLowerCase()))
      : data;

    if (!query.trim()) return tagFiltered;
    const q = query.toLowerCase();

    const matches = (text?: string) => (text || '').toLowerCase().includes(q);
    const matchesArr = (arr?: string[]) => (arr || []).some((t) => matches(t));
    const solutionMatches = (s: ProblemNode['patterns'][number]['solutions'][number]) =>
      matches(s.name) ||
      matches(s.tool) ||
      matches(s.language) ||
      matches(s.blurb) ||
      matches(s.timeComplexity) ||
      matches(s.spaceComplexity) ||
      matches(s.code) ||
      matches(s.url);

    return tagFiltered.map((p) => {
      const problemMatches =
        matches(p.problem) ||
        matches(p.subcategory) ||
        matches(p.description) ||
        matches(p.complexity) ||
        matches(p.maturity) ||
        matches(p.scale) ||
        matches(p.setupCost) ||
        matchesArr(p.tags) ||
        matchesArr(p.examples) ||
        matchesArr(p.bestFor) ||
        matchesArr(p.avoidWhen) ||
        matchesArr(p.tradeoffs);

      if (problemMatches) {
        return p;
      }

      const patterns = (p.patterns || []).map((pt) => {
        const patternMatches = matches(pt.name);
        const solutions = patternMatches ? pt.solutions : (pt.solutions || []).filter(solutionMatches);
        return { ...pt, solutions, __visible: patternMatches || solutions.length > 0 };
      }).filter((pt) => pt.__visible);

      const visible = problemMatches || patterns.length > 0;
      return visible ? { ...p, patterns } : null;
    }).filter(Boolean) as ProblemNode[];
  }, [activeTag, data, focusedProblem, query]);

  const clearFocusedHash = () => {
    if (window.location.hash) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    setFocusedProblemSlug('');
  };

  const updateQuery = (value: string) => {
    setQuery(value);
    setActiveTag('');
    clearFocusedHash();
  };

  const clearFilters = () => {
    setQuery('');
    setActiveTag('');
    clearFocusedHash();
  };

  const selectTag = (tag: string) => {
    setQuery('');
    setActiveTag(tag);
    clearFocusedHash();
    setExpandedAllVersion((v) => v + 1);
  };

  const focusProblem = (problem: string) => {
    const slug = slugify(problem);
    setQuery('');
    setActiveTag('');
    setFocusedProblemSlug(slug);
    window.location.hash = `/problem/${slug}`;
    setExpandedAllVersion((v) => v + 1);
  };

  const focusRecommendation = (value: string) => {
    focusProblem(value);
  };

  const focusFromCompare = (value: string) => {
    setViewMode('tree');
    focusProblem(value);
  };

  return (
    <div className="app-shell">
      <header className="topbar card">
        <div className="brand">
          <div className="logo">SC</div>
          <div className="titles">
            <h1>SolutionCompass</h1>
            <p className="subtitle">Problem {'->'} Pattern {'->'} Tool</p>
          </div>
        </div>
        <div className="actions">
          <SearchBar value={query} onChange={updateQuery} placeholder="Search problems, patterns, tools, tags..." />
          <div className="view-toggle" aria-label="View mode">
            <button
              className={`segment ${viewMode === 'tree' ? 'active' : ''}`}
              type="button"
              onClick={() => setViewMode('tree')}
            >
              Tree
            </button>
            <button
              className={`segment ${viewMode === 'compare' ? 'active' : ''}`}
              type="button"
              onClick={() => setViewMode('compare')}
            >
              Compare
            </button>
          </div>
          {viewMode === 'tree' && (
            <>
              <button className="btn" onClick={() => setExpandedAllVersion((v) => v + 1)} title="Expand all">Expand all</button>
              <button className="btn secondary" onClick={() => setCollapsedAllVersion((v) => v + 1)} title="Collapse all">Collapse all</button>
            </>
          )}
        </div>
      </header>
      <main className="content">
        <InstallPrompt />
        {loading && <div className="card">Loading...</div>}
        {error && <div className="card error">Error: {error}</div>}
        {!loading && !error && (
          <>
            {(query || activeTag || focusedProblem) && (
              <div className="filter-bar">
                <span>
                  {focusedProblem && <>Focused: <strong>{focusedProblem.problem}</strong></>}
                  {!focusedProblem && activeTag && <>Tag: <strong>{activeTag}</strong></>}
                  {!focusedProblem && !activeTag && query && <>Search: <strong>{query}</strong></>}
                </span>
                <button className="btn secondary compact" type="button" onClick={clearFilters}>Clear</button>
              </div>
            )}
            <Wizard data={data} onFocus={focusRecommendation} />
            {viewMode === 'tree' ? (
              <TreeCanvas
                data={filtered}
                expandAllVersion={expandedAllVersion}
                collapseAllVersion={collapsedAllVersion}
                query={query}
                activeTag={activeTag}
                focusedProblemSlug={focusedProblemSlug}
                onTagClick={selectTag}
                onProblemLink={focusProblem}
              />
            ) : (
              <CompareTable data={filtered} onFocusProblem={focusFromCompare} />
            )}
          </>
        )}
      </main>
      <footer className="footer">
        <span>Static PWA - Offline-ready</span>
      </footer>
    </div>
  );
}

export default App;
