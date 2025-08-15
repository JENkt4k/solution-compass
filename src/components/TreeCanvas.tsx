import React from 'react';
import { useTreeData } from '../hooks/useTreeData';

export default function TreeCanvas() {
  const { data, loading, error } = useTreeData();

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Software Problem → Solution Tree</h2>
      {data.map((problemNode, pIdx) => (
        <div key={pIdx} className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold text-blue-800">{problemNode.problem}</h3>
          {problemNode.subcategory && (
            <p className="text-sm text-gray-700"><em>{problemNode.subcategory}</em></p>
          )}
          <p className="text-sm text-gray-600">Tags: {problemNode.tags.join(', ')}</p>
          {problemNode.examples && problemNode.examples.length > 0 && (
            <p className="text-sm text-gray-600 mb-2">Examples: {problemNode.examples.join(', ')}</p>
          )}
          {problemNode.patterns.map((pattern, ptIdx) => (
            <div key={ptIdx} className="ml-4 mb-2">
              <h4 className="text-md font-medium text-purple-700">{pattern.name}</h4>
              <ul className="ml-4 list-disc text-sm text-gray-700">
                {pattern.solutions.map((sol, sIdx) => (
                  <li key={sIdx}>
                    <strong>{sol.name}</strong> – <em>{sol.tool}</em> ({sol.language})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}