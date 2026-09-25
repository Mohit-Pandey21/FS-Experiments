import React, { useSyncExternalStore } from "react";
import {
  getRenderCounts,
  subscribeToRenderCounts
} from "../renderMetrics";

function RenderMonitor({ events, memoEnabled }) {
  const counts = useSyncExternalStore(
    subscribeToRenderCounts,
    getRenderCounts,
    getRenderCounts
  );

  const totalRenders = Object.values(counts).reduce(
    (sum, value) => sum + value,
    0
  );

  const renderedCount = events.filter((event) => (counts[event.id] || 0) > 0).length;

  const maxCount = Math.max(
    1,
    ...events.map((event) => counts[event.id] || 0)
  );

  return (
    <aside className="monitor-card">
      <div className="monitor-heading">
        <h2 className="monitor-title">RENDER MONITOR</h2>
      </div>

      <div className="metric-row">
        <div className="metric">
          <strong className="metric-value">{totalRenders}</strong>
          <span className="metric-label">total renders logged</span>
        </div>
        <div className="metric">
          <strong className="metric-value">
            {renderedCount}/{events.length}
          </strong>
          <span className="metric-label">cards that have rendered</span>
        </div>
      </div>

      <div className="bars">
        {events.map((event) => {
          const value = counts[event.id] || 0;
          const width = `${Math.min(100, Math.max(2, (value / maxCount) * 100))}%`;
          const isGlowing = value > 0;
          return (
            <div className="bar-row" key={event.id}>
              <span className="bar-name">{event.title}</span>
              <span className={`bar-dot ${isGlowing ? "active" : ""}`} />
              <div className="bar-track">
                <i style={{ width }} className={isGlowing ? "active" : ""} />
              </div>
              <b className="bar-count">{value}</b>
            </div>
          );
        })}
      </div>

      <div className="monitor-note">
        React.memo is <strong>{memoEnabled ? "ON" : "OFF"}</strong> — only the card whose data actually changed should light up.
      </div>
    </aside>
  );
}

export default React.memo(RenderMonitor);
