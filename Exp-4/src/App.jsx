import React, { useCallback, useEffect, useMemo, useState, Suspense, lazy } from "react";
import WeekView from "./components/WeekView";
import RenderMonitor from "./components/RenderMonitor";
import LabGuideModal from "./components/LabGuideModal";
import EventModal from "./components/EventModal";
import { resetRenderCounts, getRenderCounts } from "./renderMetrics";
import { mockEventHandlers } from "./mockApi";

// Lazy-loaded component implementing Code Splitting via dynamic import (Page 2 of Manual)
const PremiumReportWidget = lazy(() => import("./components/PremiumReportWidget"));

const initialEvents = [
  { id: "design", title: "Design review", day: 0, time: "10:00", type: "meeting" },
  { id: "ship", title: "Ship v2.3", day: 0, time: "16:00", type: "deadline" },
  { id: "sam", title: "1:1 with Sam", day: 1, time: "09:30", type: "meeting" },
  { id: "proposal", title: "Write proposal", day: 2, time: "13:00", type: "focus" },
  { id: "sprint", title: "Sprint planning", day: 3, time: "11:00", type: "meeting" },
  { id: "demo", title: "Client demo", day: 4, time: "15:00", type: "meeting" },
  { id: "grocery", title: "Grocery run", day: 5, time: "10:00", type: "personal" },
  { id: "portfolio", title: "Portfolio review", day: 6, time: "18:00", type: "focus" }
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function App() {
  const [events, setEvents] = useState(initialEvents);
  const [reactMemo, setReactMemo] = useState(true);
  const [useCallbackOn, setUseCallbackOn] = useState(true);
  const [useMemoOn, setUseMemoOn] = useState(true);
  const [liveClock, setLiveClock] = useState(true);
  const [useIndexKey, setUseIndexKey] = useState(false);
  const [, setTick] = useState(0);
  const [draggedId, setDraggedId] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [toast, setToast] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [activeModalEvent, setActiveModalEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Live clock simulation that triggers regular parent re-renders (Page 1 & 4)
  useEffect(() => {
    if (!liveClock) return;
    const timer = setInterval(() => setTick((t) => (t + 1) % 10000), 450);
    return () => clearInterval(timer);
  }, [liveClock]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  // Memoized filtered events (Assignment 1 & Page 2)
  const filteredEvents = useMemo(() => {
    if (selectedType === "all") return events;
    return events.filter((event) => event.type === selectedType);
  }, [events, selectedType]);

  // Drag-and-drop state updates (Assignment 2 & Page 4)
  const moveEvent = useCallback((eventId, targetDay) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === eventId ? { ...event, day: targetDay } : event
      )
    );
    setToast("Event moved successfully");
  }, []);

  const handleDragStart = useCallback((eventId) => {
    setDraggedId(eventId);
  }, []);

  const handleDrop = useCallback((targetDay) => {
    if (draggedId !== null) moveEvent(draggedId, targetDay);
    setDraggedId(null);
  }, [draggedId, moveEvent]);

  const handleDragEnd = useCallback(() => setDraggedId(null), []);

  const resetCounters = useCallback(() => {
    resetRenderCounts();
    setToast("Render counters reset");
  }, []);

  // Fetch initial events from mock API (Assignment 5 & Page 5-6)
  const handleSyncMockApi = async () => {
    setIsSyncing(true);
    try {
      const data = await mockEventHandlers.getEvents();
      setEvents(data);
      resetRenderCounts();
      setToast("Synced with Mock API (/api/events)");
    } finally {
      setIsSyncing(false);
    }
  };

  // Add / Edit / Delete Event (Integration Flow Step 2: edit events)
  const handleSaveEvent = (savedEvent) => {
    setEvents((current) => {
      const exists = current.some((e) => e.id === savedEvent.id);
      if (exists) {
        return current.map((e) => (e.id === savedEvent.id ? savedEvent : e));
      }
      return [...current, savedEvent];
    });
    setIsModalOpen(false);
    setActiveModalEvent(null);
    setToast("Event updated successfully");
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((current) => current.filter((e) => e.id !== eventId));
    setIsModalOpen(false);
    setActiveModalEvent(null);
    setToast("Event deleted");
  };

  const handleOpenAddModal = () => {
    setActiveModalEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = useCallback((event) => {
    setActiveModalEvent(event);
    setIsModalOpen(true);
  }, []);

  const handlePillClick = (type) => {
    setSelectedType((prev) => (prev === type ? "all" : type));
  };

  // Metrics for the lazy-loaded widget
  const counts = getRenderCounts();
  const totalRenders = Object.values(counts).reduce((s, c) => s + c, 0);
  const metricsData = events.map((e) => ({
    id: e.id,
    title: e.title,
    renders: counts[e.id] || 0
  }));

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="topbar-left">
          <div className="eyebrow">UNIT 1 · EXPERIMENT 4 · LIVE DEMO</div>
          <h1>Interactive Calendar</h1>
          <p className="subtitle">
            Drag events between days, then flip the switches below to see, in real time, what React.memo, useCallback, and useMemo actually do to re-renders.
          </p>
        </div>
        <div className="topbar-actions">
          <button 
            type="button" 
            className="secondary-btn" 
            onClick={() => setShowGuide(true)}
            title="View syllabus theory, matrix, and assignments"
          >
            📖 Lab Guide
          </button>
          <button 
            type="button" 
            className="secondary-btn" 
            onClick={() => setShowReport(true)}
            title="Demonstrates Code Splitting via React.lazy and Suspense"
          >
            📊 Lazy Profiler
          </button>
          <button
            type="button"
            className="add-event-btn"
            onClick={handleOpenAddModal}
            title="Add a new calendar event"
          >
            + Add Event
          </button>
        </div>
      </header>

      <section className="control-panel">
        <div className="toggle-grid">
          <Toggle
            checked={reactMemo}
            onChange={setReactMemo}
            title="React.memo on cards"
            description="Skip a card's re-render when its own props haven't changed."
          />
          <Toggle
            checked={useCallbackOn}
            onChange={setUseCallbackOn}
            title="useCallback for handlers"
            description="Keep drag handlers referentially stable so memo isn't fooled."
          />
          <Toggle
            checked={useMemoOn}
            onChange={setUseMemoOn}
            title="useMemo for agenda filter"
            description="Cache the filtered list; recompute only when events or day change."
          />
        </div>

        <div className="control-subrow">
          <div className="subrow-left">
            <Toggle
              checked={liveClock}
              onChange={setLiveClock}
              title="Live clock"
              description="Ticks every 450ms to simulate unrelated state elsewhere in the app."
            />
            <div className="divider-v" />
            <Toggle
              checked={useIndexKey}
              onChange={setUseIndexKey}
              title={useIndexKey ? "Key: Array Index (Anti-pattern)" : "Key: Stable ID (Recommended)"}
              description={useIndexKey ? "key={index} triggers layout diffing penalties (Page 3)" : "key={item.id} provides optimal reconciliation"}
            />
          </div>
          <div className="control-actions">
            <button 
              className="ghost-btn" 
              onClick={handleSyncMockApi}
              disabled={isSyncing}
              title="Simulates API Mocking from Page 5-6"
            >
              {isSyncing ? "Syncing..." : "⚡ Mock API Sync"}
            </button>
            <button className="reset-btn" onClick={resetCounters}>
              Reset counters
            </button>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="calendar-card">
          <div className="section-heading">
            <h2 className="section-title">WEEK VIEW</h2>
            <div className="legend-filters">
              <button
                type="button"
                className={`legend-pill meeting ${selectedType === "meeting" ? "active" : ""}`}
                onClick={() => handlePillClick("meeting")}
              >
                Meeting
              </button>
              <button
                type="button"
                className={`legend-pill deadline ${selectedType === "deadline" ? "active" : ""}`}
                onClick={() => handlePillClick("deadline")}
              >
                Deadline
              </button>
              <button
                type="button"
                className={`legend-pill focus ${selectedType === "focus" ? "active" : ""}`}
                onClick={() => handlePillClick("focus")}
              >
                Focus block
              </button>
              <button
                type="button"
                className={`legend-pill personal ${selectedType === "personal" ? "active" : ""}`}
                onClick={() => handlePillClick("personal")}
              >
                Personal
              </button>
            </div>
            {/* Native select to maintain compatibility with test suites and assistive tech */}
            <select
              className="sr-select"
              aria-label="Filter events by category"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All events</option>
              <option value="meeting">meeting</option>
              <option value="deadline">deadline</option>
              <option value="focus">focus</option>
              <option value="personal">personal</option>
            </select>
          </div>

          <WeekView
            events={useMemoOn ? filteredEvents : events.filter((event) => selectedType === "all" || event.type === selectedType)}
            memoEnabled={reactMemo}
            callbackEnabled={useCallbackOn}
            onDragStart={useCallbackOn ? handleDragStart : (id) => setDraggedId(id)}
            onDrop={useCallbackOn ? handleDrop : (day) => draggedId !== null && moveEvent(draggedId, day)}
            onDragEnd={useCallbackOn ? handleDragEnd : () => setDraggedId(null)}
            draggedId={draggedId}
            days={days}
            useIndexKey={useIndexKey}
            onEditEvent={handleOpenEditModal}
          />
        </div>

        <RenderMonitor
          events={events}
          memoEnabled={reactMemo}
        />
      </section>

      {/* Code Splitting via React.lazy & Suspense (Page 2) */}
      {showReport && (
        <Suspense fallback={<div className="lazy-fallback">Loading premium interactive graphs...</div>}>
          <PremiumReportWidget
            metrics={metricsData}
            totalRenders={totalRenders}
            onClose={() => setShowReport(false)}
          />
        </Suspense>
      )}

      {/* Lab Guide Modal with full theory & assignments */}
      {showGuide && (
        <LabGuideModal onClose={() => setShowGuide(false)} />
      )}

      {/* Add / Edit Event Modal (Integration Flow Step 2) */}
      {isModalOpen && (
        <EventModal
          event={activeModalEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => {
            setIsModalOpen(false);
            setActiveModalEvent(null);
          }}
        />
      )}

      {toast && (
        <div className="toast" role="status">
          <span className="toast-icon">✓</span>
          <span>{toast}</span>
        </div>
      )}
    </main>
  );
}

function Toggle({ checked, onChange, title, description }) {
  return (
    <label className="toggle-row">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`switch ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
      <span className="toggle-copy">
        <b>{title}</b>
        <small>{description}</small>
      </span>
    </label>
  );
}