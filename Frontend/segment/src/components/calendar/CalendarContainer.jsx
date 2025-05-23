import React, { useState } from "react";
import YearView from "./YearView";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import EventDetails from "./EventDetails";
import { events } from "../../data/events";
import { getEventColor } from "../../utils/eventUtils";

export default function CalendarContainer() {
  // State for calendar view mode: "year", "month", "week"
  const [calendarView, setCalendarView] = useState("year");

  // State for year and month for month and year views
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  // State for week view date (any date in the week)
  const [weekDate, setWeekDate] = useState(new Date());

  // State for selected date string (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(null);

  // Handlers for YearView navigation and selection
  function handleSetViewYear(year) {
    setViewYear(year);
  }
  function handleSetViewMonth(month) {
    setViewMonth(month);
  }

  // Handlers for MonthView navigation and selection
  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }
  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }
  function handleSelectDate(dateStr) {
    setSelectedDate(dateStr);
  }
  function handleGoToWeekView(dateStr) {
    setWeekDate(new Date(dateStr));
    setCalendarView("week");
    setSelectedDate(dateStr);
  }

  // Handlers for WeekView navigation and selection
  function handlePrevWeek() {
    const newDate = new Date(weekDate);
    newDate.setDate(newDate.getDate() - 7);
    setWeekDate(newDate);
  }
  function handleNextWeek() {
    const newDate = new Date(weekDate);
    newDate.setDate(newDate.getDate() + 7);
    setWeekDate(newDate);
  }
  function handleWeekSelectDate(dateStr) {
    setSelectedDate(dateStr);
  }

  // Handler to go back to year view from week or month
  function handleBackToYearView() {
    setCalendarView("year");
    setSelectedDate(null);
  }

  return (
    <div className="calendar-container">
      {calendarView === "year" && (
        <YearView
          initialYear={viewYear}
          setViewYear={handleSetViewYear}
          setViewMonth={handleSetViewMonth}
          setCalendarView={setCalendarView}
        />
      )}
      {calendarView === "month" && (
        <MonthView
          year={viewYear}
          month={viewMonth}
          selectedDateStr={selectedDate}
          onSelectDate={handleSelectDate}
          getEventColor={getEventColor}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onGoToWeekView={handleGoToWeekView}
          events={events}
        />
      )}
      {calendarView === "week" && (
        <WeekView
          weekDate={weekDate}
          selectedDate={selectedDate}
          onSelectDate={handleWeekSelectDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
          events={events}
        />
      )}
      {selectedDate && (
        <div className="event-details-container">
          <button onClick={handleBackToYearView}>Back to Year View</button>
          <EventDetails dateStr={selectedDate} getEventColor={getEventColor} />
        </div>
      )}
    </div>
  );
}

