import { useEffect, useState } from 'react';

export interface Solution {
  name: string;
  tool: string;
  language: string;
  blurb?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  code?: string;
  url?: string;
}

export interface Pattern {
  name: string;
  solutions: Solution[];
}

export interface ProblemNode {
  problem: string;
  scopeLevel?: 'architecture' | 'stack' | 'runtime' | 'library' | 'language' | 'algorithm' | 'hardware';
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

export const useTreeData = (): { data: ProblemNode[]; loading: boolean; error: string | null } => {
  const [data, setData] = useState<ProblemNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isDev = import.meta.env.DEV;
    const base = import.meta.env.BASE_URL || '/';
    const dataUrl = `${isDev ? '/' : base}complete-tree-data.json`;

    fetch(dataUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load tree data');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
};
