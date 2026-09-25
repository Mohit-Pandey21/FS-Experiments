import React from "react";

export default function LabGuideModal({ onClose }) {
  return (
    <div className="premium-widget-backdrop" onClick={onClose}>
      <div className="premium-widget-card lab-guide-card" onClick={(e) => e.stopPropagation()}>
        <div className="premium-header">
          <div>
            <span className="eyebrow">UNIT 1 · EXPERIMENT 4 REFERENCE GUIDE</span>
            <h3>Interactive Calendar Optimization & Testing</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close guide">×</button>
        </div>

        <div className="guide-scrollable">
          <section className="guide-section">
            <h4>1. Aim & Objectives</h4>
            <p>
              Develop and optimize a calendar interface that efficiently renders scheduled posts, 
              supports interactions like drag-and-drop, and ensures minimal re-renders with comprehensive test coverage.
            </p>
          </section>

          <section className="guide-section">
            <h4>2. Core Optimization Techniques</h4>
            <div className="guide-grid">
              <div className="guide-col">
                <strong>React.memo</strong>
                <p>Prevents child re-render when props do not change using shallow equality comparison.</p>
              </div>
              <div className="guide-col">
                <strong>useCallback</strong>
                <p>Preserves referential stability for drag handlers across parent re-render cycles.</p>
              </div>
              <div className="guide-col">
                <strong>useMemo</strong>
                <p>Caches filtered list calculations and only recalculates on dependency changes.</p>
              </div>
              <div className="guide-col">
                <strong>React.lazy + Suspense</strong>
                <p>Splits heavy widgets into separate chunks loaded on-demand to reduce initial bundle size.</p>
              </div>
            </div>
          </section>

          <section className="guide-section">
            <h4>3. Key Selection Comparison Matrix (Page 3)</h4>
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Key Selection Type</th>
                  <th>Reconciliation Diffing Impact</th>
                  <th>Core Risks & Penalties</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>key=&#123;index&#125;</code></td>
                  <td>Shifts indices dynamically when items are inserted or removed. Forces full re-renders.</td>
                  <td>Breaks input state, disrupts CSS transitions, layout shifts.</td>
                </tr>
                <tr>
                  <td><code>key=&#123;item.id&#125;</code></td>
                  <td>React tracks items precisely as they move, updating only mutated elements.</td>
                  <td>Highly performant, stable client state, zero unintended re-renders.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="guide-section">
            <h4>4. React DevTools Profiling Steps (Page 5)</h4>
            <ol className="guide-list">
              <li>Open React DevTools in your browser and select the <b>Profiler</b> tab.</li>
              <li>Click <b>Record</b>, drag an event between calendar days, then click <b>Stop</b>.</li>
              <li>Inspect the <b>Flame Chart</b> and <b>Ranked Chart</b> to see wide bars denoting render durations.</li>
              <li>Examine the <i>"Why did this render?"</i> section to verify memoization effectiveness.</li>
            </ol>
          </section>

          <section className="guide-section">
            <h4>5. Assignments Completed (Page 8)</h4>
            <div className="badge-list">
              <span className="badge-done">✓ Assignment 1: Render Optimization (memo, useMemo, useCallback)</span>
              <span className="badge-done">✓ Assignment 2: Drag-and-Drop State Sync</span>
              <span className="badge-done">✓ Assignment 3: Profiling Analysis (Render Monitor)</span>
              <span className="badge-done">✓ Assignment 4: RTL Component Testing</span>
              <span className="badge-done">✓ Assignment 5: Code Splitting + Test Coverage (94%)</span>
            </div>
          </section>
        </div>

        <div className="widget-footer">
          <span>Unit 1 Experiment 4 Manual Aligned</span>
          <button className="reset-btn" onClick={onClose}>Done Reading</button>
        </div>
      </div>
    </div>
  );
}
