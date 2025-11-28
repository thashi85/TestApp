"use client";

import React, { useRef, useState, useEffect } from "react";
import { ViewType, TimeInterval, Facility, Booking, RowHeights } from "@/lib/scheduler/types";
import { getDateRange, formatTime, flattenFacilities, getCellMinWidth } from "@/lib/scheduler/utils";

interface SchedulerGridProps {
  view: ViewType;
  timeInterval: TimeInterval;
  startDate: Date;
  facilities: Facility[];
  bookings: Booking[];
  //rowHeights: RowHeights;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onCellClick?: (facilityId: string, date: Date, hour: number, minute: number) => void;
  onToggle: (facilityId: string) => void;
}

export const SchedulerGrid: React.FC<SchedulerGridProps> = ({
  view,
  timeInterval,
  startDate,
  facilities,
  bookings,
  //rowHeights,
  scrollRef,
  onCellClick,
  onToggle,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const dates = getDateRange(view, startDate);
  const flatFacilities = flattenFacilities(facilities);
  const subCellsPerHour = view === "day" ? 60 / timeInterval : 1;

  // Track screen width for responsive cell sizing
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log("Flat Facilities in SchedulerGrid:", flatFacilities);

  /*   const renderTimeHeaders = () => {
      return (
        <div className="flex flex-1">
          <div style={{ width: "150px" }}></div>
          <div className="flex flex-1">
            {dates.map((date, dayIndex) => (
              <div key={dayIndex} className="day-column">
                <div className="day-header">
                  <div className="day-name">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                  <div className="day-date">{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }; */

  const FacilityItemRow: React.FC<{
    facility: Facility;
    onToggle: (id: string) => void;
  }> = ({ facility, onToggle }) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const hasChildren = facility.children && facility.children.length > 0;
    const paddingLeft = (facility.level ?? 0) * 20;

    return (
      <>
        <div
          ref={itemRef}
          className={`facility-item facility-${facility.type}`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          data-facility-id={facility.id}
        >
          {hasChildren && (
            <button
              className="expand-button"
              onClick={() => onToggle(facility.id)}
              aria-label={facility.isExpanded ? "Collapse" : "Expand"}
            >
              {facility.isExpanded ? "▼" : "▶"}
            </button>
          )}
          <span className="facility-name">{facility.name}</span>
        </div>
      </>
    );
  };

  const renderDayTimeRows = () => {
    const totalHours = 24;
    const cellMinWidth = getCellMinWidth(view, screenWidth);
    const isDayView = view === "day";

    return (
      <>
        {/* Days Row */}
        <div className="header-days-row">
          <div className="flex flex-1">
            <div style={{ width: "150px", minWidth: "150px", flexShrink: 0, textWrap: "auto", borderRight: "1px solid #dee2e6", padding: "0.5rem" }}>
              Venue / Spaces
            </div>
            <div className={`flex ${!isDayView ? 'overflow-x-auto' : 'flex-1'}`} style={{ flexShrink: isDayView ? 1 : 0 }}>
              {dates.map((date, dayIndex) => (
                <div
                  key={`day-${dayIndex}`}
                  className={`flex-1`}
                  style={{
                    minWidth: isDayView ? undefined : `calc(${cellMinWidth} * ${totalHours * subCellsPerHour})`,
                    flex: isDayView ? '1 1 auto' : `0 0 calc(${cellMinWidth} * ${totalHours * subCellsPerHour} + ${totalHours * subCellsPerHour * 1}px)`
                  }}
                >
                  <div className="day-header text-center p-2 border-r border-gray-300">
                    <div className="day-name">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <div className="day-date">{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Row */}
        <div className="header-time-row">
          <div className="flex flex-1">
            <div style={{ width: "150px", minWidth: "150px", flexShrink: 0, borderRight: "1px solid #dee2e6" }}></div>
            <div className={`flex ${!isDayView ? 'overflow-x-auto' : 'flex-1'}`}
              style={{ flexShrink: isDayView ? 1 : 0 }}>
              {dates.map((date, dayIndex) => (
                <div
                  key={`time-${dayIndex}`}
                  className={`flex ${isDayView ? 'flex-1' : ''} `}
                  style={{
                    minWidth: isDayView ? undefined : `calc(${cellMinWidth} * ${totalHours * subCellsPerHour})`,
                    flex: isDayView ? '1 1 auto' : `0 0 calc(${cellMinWidth} * ${totalHours * subCellsPerHour}  + ${totalHours * subCellsPerHour * 1}px)`
                  }}
                >
                  {Array.from({ length: totalHours }, (_, hour) => {
                    // Only show the label if it's day view OR every 3 hours in other views
                    const shouldShowLabel = view === "day" || hour % 3 === 0;
                    return (

                      <div
                        key={hour}
                        className={`flex flex-row hours-cell text-sm justify-center items-center p-1`}
                        style={{ minWidth: `calc(${cellMinWidth} * ${subCellsPerHour})`, flex: '1 1 auto' }}
                      >
                        {shouldShowLabel && `${String(hour).padStart(2, '0')}:00`}

                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderFacilityRows = () => {
    const totalHours = 24;
    const cellMinWidth = getCellMinWidth(view, screenWidth);
    const isDayView = view === "day";

    return flatFacilities.map((facility) => {
      return (
        <div
          key={facility.id}
          className="facility-data-row"
          data-facility-id={facility.id}
        >
          <div className="flex flex-1">
            <div style={{ width: "150px", minWidth: "150px", flexShrink: 0, textWrap: "auto", borderRight: "1px solid #dee2e6" }}>
              <FacilityItemRow key={facility.id} facility={facility} onToggle={onToggle} />
            </div>
            <div className={`flex ${!isDayView ? 'overflow-x-auto' : 'flex-1'}`}
              style={{ flexShrink: isDayView ? 1 : 0 }}>
              {dates.map((date, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`flex facility-${facility.type} ${isDayView ? 'flex-1' : ''} day-cell ${dayIndex > 0 ? "solid-border-left" : ""}`}
                  style={{

                    minWidth: isDayView ? undefined : `calc(${cellMinWidth} * ${totalHours * subCellsPerHour})`,
                    flex: isDayView ? '1 1 auto' : `0 0 calc(${cellMinWidth} * ${totalHours * subCellsPerHour}  + ${totalHours * subCellsPerHour * 1}px)`
                  }}
                >
                  {Array.from({ length: 24 }, (_, hour) => (
                    <div
                      key={hour}
                      className={`flex flex-row hours-cell solid-border-left`}
                      style={{ minWidth: `calc(${cellMinWidth} * ${subCellsPerHour})`, flex: '1 1 auto' }}
                    >
                      {Array.from({ length: subCellsPerHour }, (_, subIndex) => {
                        const minute = view === "day" ? subIndex * timeInterval : 0;
                        return (
                          <div
                            key={`${hour}-${subIndex}`}
                            className={`time-block-cell ${subIndex > 0 ? "dashed-border-left" : ""}`}
                            style={{ minWidth: cellMinWidth, flex: '1 1 auto' }}
                            onClick={() => onCellClick?.(facility.id, date, hour, minute)}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={`scheduler-grid view-${view}`}>
      {/*  <div className="time-headers">{renderTimeHeaders()}</div> */}
      <div className="facility-rows" ref={scrollRef}>
        {renderDayTimeRows()}
        {renderFacilityRows()}
      </div>
    </div>
  );
};
