import React from "react";


export default function CompletedEventsDropdown({ completedEvents, onSelect }) {
  return (
    <select
     style={{
    padding: "8px 12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
    borderBlockColor: "white",
    boxShadow: "none"
  }}
    onChange={e => onSelect(e.target.value)}>
      <option value="">Select Event</option>
      {completedEvents.map((e, i) => (
        <option key={e.title + e.date} value={i}>
          {e.title} ({e.date})
        </option>
      ))}
    </select>
  );
}
