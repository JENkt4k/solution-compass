import { useEffect, useState } from 'react';

export interface Solution {
  name: string;
  tool: string;
  language: string;
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
  patterns: Pattern[];
}

export const useTreeData = (): { data: ProblemNode[]; loading: boolean; error: string | null } => {
  const [data, setData] = useState<ProblemNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/complete-tree-data.json')
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