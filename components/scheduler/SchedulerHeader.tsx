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
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(startDate);
    const delta = direction === "next" ? 1 : -1;

    switch (view) {
      case "day":
        newDate.setDate(newDate.getDate() + delta);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + delta * 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + delta);
        break;
    }

    onDateChange(newDate);
  };

  const formatDateDisplay = () => {
    const options: Intl.DateTimeFormatOptions =
      view === "month" ? { year: "numeric", month: "long" } : { year: "numeric", month: "short", day: "numeric" };

    return startDate.toLocaleDateString("en-US", options);
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
