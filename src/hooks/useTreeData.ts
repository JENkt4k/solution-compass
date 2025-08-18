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
    // const dataUrl = new URL('complete-tree-data.json', import.meta.env.BASE_URL).toString();
    // const baseUrl = import.meta.env.BASE_URL || '/';
    // const dataUrl = new URL('complete-tree-data.json', window.location.origin + baseUrl).toString();
    const dataUrl = new URL('complete-tree-data.json', document.baseURI).toString();
    // const res = await fetch(dataUrl);
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