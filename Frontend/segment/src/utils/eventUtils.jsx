import { eventTypeColors } from "../data/eventTypeColors";
import { events } from "../data/events";

export function getEventsForDate(dateStr) {
  return events.filter(ev => ev.date === dateStr);
}

export function getEventColor(type) {
  return eventTypeColors[type] || "#888";
}

export function getEventsForMonth(year, month) {
  return events.filter(ev => {
    const [evYear, evMonth] = ev.date.split('-').map(Number);
    return evYear === year && evMonth - 1 === month;
  });
}
