import React from "react";

// Helper to format date string (YYYY-MM-DD)
function formatDate(year, month, day) {
  return `${year}-${(month + 1).toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function MonthView({
  year,
  month,
  selectedDateStr,
  onSelectDate,
  getEventColor,
  onPrevMonth,
  onNextMonth,
  onGoToWeekView, // <--- NEW PROP
  events = []
}) {
  console.log("MonthView props - year:", year, "month:", month);
  const firstDay = new Date(year, month, 1);
  const firstDayIndex = firstDay.getDay();
  const lastDay = new Date(year, month + 1, 0);
  const numberOfDays = lastDay.getDate();
  const prevLastDay = new Date(year, month, 0).getDate();

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = [];

  // Previous month's days
  for (let i = firstDayIndex; i > 0; i--) {
    days.push(
      <div key={`prev-${i}`} className="day calendar-other">
        <span className="day-number">{prevLastDay - i + 1}</span>
      </div>
    );
  }
  // Current month days
  for (let day = 1; day <= numberOfDays; day++) {
    const dateStr = formatDate(year, month, day);
    const dayEvents = events.filter(ev => ev.date === dateStr);
    days.push(
      <div
        key={dateStr}
        className={`day${selectedDateStr === dateStr ? " selected" : ""}`}
        onClick={() => onSelectDate(dateStr)}
      >
        <span className="day-number">{day}</span>
        {dayEvents.length > 0 && (
          <div className="event-dots">
            {dayEvents.slice(0, 4).map(ev => (
              <span
                key={ev.title}
                className={`event-dot ${ev.type}`}
                style={{ background: getEventColor(ev.type) }}
                title={ev.title + (ev.time ? ` (${ev.time})` : "")}
              />
            ))}
            {dayEvents.length > 4 && (
              <div className="more-events">+{dayEvents.length - 4} more</div>
            )}
          </div>
        )}
      </div>
    );
  }
  // Next month's days
  const totalCells = firstDayIndex + numberOfDays;
  const nextDays = 7 - (totalCells % 7 === 0 ? 7 : totalCells % 7);
  for (let i = 1; i <= nextDays; i++) {
    days.push(
      <div key={`next-${i}`} className="day calendar-other">
        <span className="day-number">{i}</span>
      </div>
    );
  }

  return (
    <div className="monthview-container">
      <div className="calendar-topbar">
        <button className="calendar-nav-btn" onClick={onPrevMonth}>&lt;</button>
        <span className="calendar-month-label">
          {MONTHS[month]} {year}
        </span>
        <button className="calendar-nav-btn" onClick={onNextMonth}>&gt;</button>
        
        
      </div>
      <div className="calendar-days">
        {weekDays.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
}
