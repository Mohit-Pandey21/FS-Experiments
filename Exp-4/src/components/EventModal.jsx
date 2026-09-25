import React, { useState } from "react";

export default function EventModal({ event, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(event?.title || "");
  const [time, setTime] = useState(event?.time || "10:00");
  const [day, setDay] = useState(event?.day ?? 0);
  const [type, setType] = useState(event?.type || "meeting");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: event?.id || `event-${Date.now()}`,
      title: title.trim(),
      time,
      day: Number(day),
      type
    });
  };

  return (
    <div className="premium-widget-backdrop" onClick={onClose}>
      <div className="premium-widget-card event-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="premium-header">
          <div>
            <span className="eyebrow">EVENT STATE SYNCHRONIZATION</span>
            <h3>{event ? "Edit Scheduled Event" : "Create New Calendar Event"}</h3>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="event-title-input">Event Title</label>
            <input
              id="event-title-input"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Architecture Review"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="event-time-input">Time</label>
              <input
                id="event-time-input"
                type="text"
                className="form-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-day-select">Scheduled Day</label>
              <select
                id="event-day-select"
                className="form-select"
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
              >
                <option value={0}>Monday</option>
                <option value={1}>Tuesday</option>
                <option value={2}>Wednesday</option>
                <option value={3}>Thursday</option>
                <option value={4}>Friday</option>
                <option value={5}>Saturday</option>
                <option value={6}>Sunday</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="event-type-select">Category</label>
            <select
              id="event-type-select"
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="focus">Focus block</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          <div className="modal-actions">
            {event && onDelete && (
              <button
                type="button"
                className="danger-btn"
                onClick={() => onDelete(event.id)}
              >
                Delete Event
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="ghost-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-btn">
                {event ? "Save Changes" : "Create Event"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
