import React, { useCallback, useEffect } from "react";
import { recordRender } from "../renderMetrics";

function EventCardBase({ event, callbackEnabled, onDragStart, onDragEnd, onEditEvent }) {
  // Console log explicitly specified in Unit 1 Experiment 4 Manual (Page 2)
  console.log("Rendered: ", event.title);

  // Update metrics store for the render monitor
  useEffect(() => {
    recordRender(event.id);
  });

  const dragStart = useCallback(() => {
    onDragStart(event.id);
  }, [event.id, onDragStart]);

  const dragEnd = useCallback(() => {
    onDragEnd();
  }, [onDragEnd]);

  const startHandler = callbackEnabled
    ? dragStart
    : () => onDragStart(event.id);
  const endHandler = callbackEnabled
    ? dragEnd
    : () => onDragEnd();

  return (
    <article
      className={`event-card ${event.type}`}
      draggable
      onDragStart={startHandler}
      onDragEnd={endHandler}
      data-testid={`event-${event.id}`}
      title={`Drag ${event.title} to another day or click to edit`}
      onClick={() => onEditEvent && onEditEvent(event)}
    >
      <div className="event-card-header">
        <span className="event-time">{event.time}</span>
        <button 
          type="button" 
          className="edit-icon-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onEditEvent && onEditEvent(event);
          }}
          title="Edit event"
          aria-label={`Edit ${event.title}`}
        >
          ✎
        </button>
      </div>
      <div className="event-title">{event.title}</div>
    </article>
  );
}

const EventCardMemo = React.memo(EventCardBase);

export default function EventCard(props) {
  return props.memoEnabled ? (
    <EventCardMemo {...props} />
  ) : (
    <EventCardBase {...props} />
  );
}
