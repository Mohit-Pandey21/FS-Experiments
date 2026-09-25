import React, { useMemo } from "react";
import EventCard from "./EventCard";

function WeekView({
  events,
  memoEnabled,
  callbackEnabled,
  onDragStart,
  onDrop,
  onDragEnd,
  draggedId,
  days,
  useIndexKey = false,
  onEditEvent
}) {
  const grouped = useMemo(() => {
    const result = days.map(() => []);
    events.forEach((event) => result[event.day]?.push(event));
    result.forEach((dayEvents) =>
      dayEvents.sort((a, b) => a.time.localeCompare(b.time))
    );
    return result;
  }, [events, days]);

  return (
    <div className="week-grid">
      {days.map((day, dayIndex) => (
        <div
          className={`day-column ${draggedId !== null ? "drop-ready" : ""}`}
          key={day}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(dayIndex)}
          data-testid={`day-${dayIndex}`}
        >
          <div className="day-header">
            <span>{day}</span>
          </div>
          <div className="event-stack">
            {grouped[dayIndex].map((event, eventIdx) => (
              <EventCard
                // Demonstrates Page 3 Key Selection Matrix: Stable key vs Array index key
                key={useIndexKey ? eventIdx : event.id}
                event={event}
                memoEnabled={memoEnabled}
                callbackEnabled={callbackEnabled}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onEditEvent={onEditEvent}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(WeekView);