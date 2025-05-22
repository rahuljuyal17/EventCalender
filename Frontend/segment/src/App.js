import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { events } from "./data/events";
import { clubs } from "./data/Clubs";
import { getEventColor } from "./utils/eventUtils";
import ClubSelector from "./components/sidebar/ClubSelector";
import MembersList from "./components/sidebar/MembersList";
import CompletedEventsDropdown from "./components/RightPanel/CompletedEventsDropdown";
import UpcomingEventsList from "./components/RightPanel/UpcomingEventsList";
import MonthView from "./components/calendar/MonthView";
import WeekView from "./components/calendar/WeekView";
import YearView from "./components/calendar/YearView";
import EventDetails from "./components/calendar/EventDetails";
import LoginPage from "./components/LoginPage/LoginPage";
import SignupPage from "./components/LoginPage/SignupPage";
import EventForm from "./components/EventForm";
import "./App.css";
import "./index.css";

function Dashboard({ isAuthenticated }) {
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState("");
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [viewYear, setViewYear] = useState(2025);
  const [viewMonth, setViewMonth] = useState(4);
  const [calendarView, setCalendarView] = useState("month");

  const weekDate = calendarView === "week" && !selectedDateStr
    ? new Date()
    : selectedDateStr
      ? new Date(selectedDateStr)
      : new Date(viewYear, viewMonth, 1);

  const completedEvents = events.filter(e => e.completed);
  const upcomingEvents = events.filter(e => !e.completed);

  const handlePrevMonth = () => setViewMonth(m => m === 0 ? (setViewYear(y => y - 1), 11) : m - 1);
  const handleNextMonth = () => setViewMonth(m => m === 11 ? (setViewYear(y => y + 1), 0) : m + 1);

  const handlePrevWeek = () => setSelectedDateStr(dateStr => {
    const d = dateStr ? new Date(dateStr) : new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const handleNextWeek = () => setSelectedDateStr(dateStr => {
    const d = dateStr ? new Date(dateStr) : new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  const handleAddEventClick = () => {
    if (isAuthenticated) {
      navigate('/event-form');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="app-bg">
      <header className="app-header">
        <h1>Campus Events Calendar</h1>
        <div className="action-buttons">
          <button className={calendarView === "month" ? "active" : ""} onClick={() => setCalendarView("month")}>Month</button>
          <button className={calendarView === "week" ? "active" : ""} onClick={() => {
            setCalendarView("week");
            if (!selectedDateStr) setSelectedDateStr(new Date().toISOString().slice(0, 10));
          }}>Week</button>
          <button className={calendarView === "year" ? "active" : ""} onClick={() => setCalendarView("year")}>Year</button>
          <button onClick={handleAddEventClick}>Add an event</button>
        </div>
      </header>
      <div className="dashboard">
        <aside className="sidebar glass-panel">
          <div className="section-title">Clubs & Organizers</div>
          <ClubSelector clubs={clubs} selectedClub={selectedClub} onChange={setSelectedClub} />
          <div className="section-title" style={{ marginTop: 16 }}>Members</div>
          <MembersList members={clubs[selectedClub]} />
        </aside>
        <main className="calendar-panel glass-panel">
          {calendarView === "month" ? (
            <MonthView year={viewYear} month={viewMonth} selectedDateStr={selectedDateStr} onSelectDate={setSelectedDateStr} getEventColor={getEventColor} onPrevMonth={handlePrevMonth} onNextMonth={handleNextMonth} onGoToWeekView={() => setCalendarView("week")} events={events} />
          ) : calendarView === "week" ? (
            <WeekView weekDate={weekDate} selectedDate={selectedDateStr} onSelectDate={setSelectedDateStr} onPrevWeek={handlePrevWeek} onNextWeek={handleNextWeek} events={events} />
          ) : (
            <YearView initialYear={viewYear} setViewMonth={setViewMonth} setViewYear={setViewYear} setCalendarView={setCalendarView} />
          )}
        </main>
        <aside className="right-panel glass-panel">
          <div className="section-title">Completed Events</div>
          <CompletedEventsDropdown completedEvents={completedEvents} onSelect={() => {}} />
          <button className="download-btn"><span className="button-content">Download Report</span></button>
          <div className="section-title">Upcoming Events</div>
          <UpcomingEventsList upcomingEvents={upcomingEvents} />
          <div className="section-title" style={{ marginTop: 24 }}>Events on Selected Day</div>
          <EventDetails dateStr={selectedDateStr} getEventColor={getEventColor} />
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/event-form" element={isAuthenticated ? <EventForm /> : <Navigate to="/login" />} />
        <Route path="/" element={<Dashboard isAuthenticated={isAuthenticated} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
