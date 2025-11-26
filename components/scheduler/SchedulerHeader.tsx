"use client";

import React from "react";
import { ViewType, TimeInterval } from "@/lib/scheduler/types";

interface SchedulerHeaderProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  timeInterval: TimeInterval;
  onIntervalChange: (interval: TimeInterval) => void;
  startDate: Date;
  onDateChange: (date: Date) => void;
}

export const SchedulerHeader: React.FC<SchedulerHeaderProps> = ({
  view,
  onViewChange,
  timeInterval,
  onIntervalChange,
  startDate,
  onDateChange,
}) => {
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [calendarMonth, setCalendarMonth] = React.useState(new Date());
  const [isSmallScreen, setIsSmallScreen] = React.useState(false);
  const calendarRef = React.useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  // Detect screen size for responsive design
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getStartOfWeek = (date: Date) => {
    const newDate = new Date(date);
    const dayOfWeek = newDate.getDay();
    newDate.setDate(newDate.getDate() - dayOfWeek);
    return newDate;
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(startDate);
    const delta = direction === "next" ? 1 : -1;

    switch (view) {
      case "day":
        newDate.setDate(newDate.getDate() + delta);
        break;
      case "week":
        // Move to next/previous week
        newDate.setDate(newDate.getDate() + delta * 7);
        // Then set to the start of that week (Sunday)
        const dayOfWeek = newDate.getDay();
        newDate.setDate(newDate.getDate() - dayOfWeek);
        break;
      case "month":
        // Move to next/previous month
        newDate.setMonth(newDate.getMonth() + delta);
        // Then set to the 1st of that month
        newDate.setDate(1);
        break;
    }

    onDateChange(newDate);
  };

  const formatDateDisplay = () => {
    const options: Intl.DateTimeFormatOptions =
      view === "month" ? { year: "numeric", month: "long" } : { year: "numeric", month: "short", day: "numeric" };

    return startDate.toLocaleDateString("en-US", options);
  };

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setShowCalendar(false);
  };

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
    setCalendarMonth(startDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateCalendarMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === "next" ? 1 : -1));
    setCalendarMonth(newMonth);
  };

  // Render calendar popup with responsive design
  const renderCalendar = () => {
    if (!showCalendar) return null;

    return (
      <div className={`
        absolute top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50
        ${isSmallScreen ? 'right-0 left-0 mx-2 w-auto' : 'right-0 w-80'}
      `}>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateCalendarMonth("prev")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className={`font-semibold text-gray-800 ${isSmallScreen ? 'text-base' : 'text-lg'}`}>
            {calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <button
            onClick={() => navigateCalendarMonth("next")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {isSmallScreen ? day.charAt(0) : day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth(calendarMonth).map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isToday =
              date.getDate() === new Date().getDate() &&
              date.getMonth() === new Date().getMonth() &&
              date.getFullYear() === new Date().getFullYear();

            const isSelected =
              date.getDate() === startDate.getDate() &&
              date.getMonth() === startDate.getMonth() &&
              date.getFullYear() === startDate.getFullYear();

            return (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                className={`
                  aspect-square flex items-center justify-center rounded-lg font-medium
                  transition-all duration-200
                  ${isSmallScreen ? 'text-xs' : 'text-sm'}
                  ${isSelected
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : isToday
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="scheduler-header">
      <div className="header-left">
        <h2>Facility Booking</h2>
      </div>

      <div className="header-center">
        <button onClick={() => navigateDate("prev")} className="nav-button">
          ◀
        </button>
        <span className="date-display">{formatDateDisplay()}</span>
        <button onClick={() => navigateDate("next")} className="nav-button">
          ▶
        </button>
        <button onClick={() => onDateChange(new Date())} className="today-button">
          Today
        </button>

        <div className="relative" ref={calendarRef}>
          <button onClick={handleCalendarClick} className="calendar-button" title="Select date">
            📅
          </button>

          {renderCalendar()}
        </div>
      </div>

      <div className="header-right">
        <div className="view-selector">
          <button className={view === "day" ? "active" : ""} onClick={() => onViewChange("day")}>
            Day
          </button>
          <button className={view === "week" ? "active" : ""} onClick={() => onViewChange("week")}>
            Week
          </button>
          <button className={view === "month" ? "active" : ""} onClick={() => onViewChange("month")}>
            Month
          </button>
        </div>

        {view === "day" && (
          <select
            value={timeInterval}
            onChange={(e) => onIntervalChange(Number(e.target.value) as TimeInterval)}
            className="interval-selector"
          >
            <option value={10}>10 min</option>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>60 min</option>
          </select>
        )}
      </div>
    </div>
  );
};
