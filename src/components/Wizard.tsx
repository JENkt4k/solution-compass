import React, { useMemo, useState } from 'react';
import { ProblemNode } from '../hooks/useTreeData';
import { getRecommendations, questions } from '../lib/wizardScoring.mjs';

type Recommendation = {
  node: ProblemNode;
  score: number;
  reasons: string[];
  penalties: string[];
};

function firstSolution(node: ProblemNode) {
  const pattern = node.patterns?.[0];
  const solution = pattern?.solutions?.[0];
  if (!pattern || !solution) return null;
  return `${pattern.name}: ${solution.name}`;
}

export default function Wizard({ data, onFocus }: { data: ProblemNode[]; onFocus: (query: string) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const recommendations = useMemo<Recommendation[]>(() => {
    const answered = Object.keys(answers).length;
    if (!answered) return [];

    return getRecommendations(data, answers, 5) as Recommendation[];
  }, [answers, data]);

  const reset = () => setAnswers({});

  return (
    <section className="wizard">
      <div className="wizard-header">
        <div>
          <h2>Decision Wizard</h2>
          <p>Answer a few prompts to get ranked problem areas with reasons and tradeoffs.</p>
        </div>
        <button className="btn secondary" type="button" onClick={reset}>Reset</button>
      </div>

      <div className="wizard-questions">
        {questions.map((question) => (
          <fieldset className="wizard-question" key={question.id}>
            <legend>{question.prompt}</legend>
            <div className="segmented">
              {question.options.map((option) => {
                const active = answers[question.id] === option.label;
                return (
                  <button
                    className={`segment ${active ? 'active' : ''}`}
                    type="button"
                    key={option.label}
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.label }))}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="recommendations">
        {recommendations.length === 0 ? (
          <div className="recommendation-empty">Choose one or more answers to rank matching problem areas.</div>
        ) : recommendations.map((item, index) => (
          <article className="recommendation" key={item.node.problem}>
            <div className="recommendation-topline">
              <span className="rank">#{index + 1}</span>
              <div>
                <h3>{item.node.problem}</h3>
                <p>{item.node.description}</p>
              </div>
              <button className="copy-btn" type="button" onClick={() => onFocus(item.node.problem)}>Focus</button>
            </div>
            <div className="decision-meta">
              <span>Complexity: {item.node.complexity}</span>
              <span>Setup: {item.node.setupCost}</span>
              <span>Maturity: {item.node.maturity}</span>
              <span>Scale: {item.node.scale}</span>
            </div>
            <div className="recommendation-detail">
              <div>
                <strong>Why it matched</strong>
                <ul>
                  {item.reasons.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}
                </ul>
              </div>
              <div>
                <strong>Start with</strong>
                <ul>
                  {item.node.firstMove && <li>{item.node.firstMove}</li>}
                  {firstSolution(item.node) && <li>{firstSolution(item.node)}</li>}
                  {(item.node.bestFor || []).slice(0, 2).map((fit) => <li key={fit}>{fit}</li>)}
                </ul>
              </div>
              <div>
                <strong>Watch outs</strong>
                <ul>
                  {item.penalties.slice(0, 1).map((penalty) => <li key={penalty}>{penalty}</li>)}
                  {(item.node.avoidWhen || []).slice(0, 1).map((avoid) => <li key={avoid}>{avoid}</li>)}
                  {(item.node.tradeoffs || []).slice(0, 2).map((tradeoff) => <li key={tradeoff}>{tradeoff}</li>)}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
