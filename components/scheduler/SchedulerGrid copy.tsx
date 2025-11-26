/* "use client";

import React, { useRef } from "react";
import { ViewType, TimeInterval, Facility, Booking, RowHeights } from "@/lib/scheduler/types";
import { getDateRange, formatTime, flattenFacilities } from "@/lib/scheduler/utils";

interface SchedulerGridProps {
  view: ViewType;
  timeInterval: TimeInterval;
  startDate: Date;
  facilities: Facility[];
  bookings: Booking[];
  rowHeights: RowHeights;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onCellClick?: (facilityId: string, date: Date, hour: number, minute: number) => void;
}
export const SchedulerGrid: React.FC<SchedulerGridProps> = ({
  view,
  timeInterval,
  startDate,
  facilities,
  bookings,
  rowHeights,
  scrollRef,
  onCellClick,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const dates = getDateRange(view, startDate);
  const flatFacilities = flattenFacilities(facilities);
  const subCellsPerHour = view === "day" ? 60 / timeInterval : 1;

  const renderTimeHeaders = () => {
    return dates.map((date, dayIndex) => (
      <div key={dayIndex} className="day-column">
        <div className="day-header">
          <div className="day-name">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
          <div className="day-date">{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
        </div>
        <div className="hours-container">
          {Array.from({ length: 24 }, (_, hour) => (
            <div key={hour} className="hour-column">
              {view === "day" ? <div className="hour-header">{formatTime(hour)}</div> : null}
              <div className="subcells-container">
                {Array.from({ length: subCellsPerHour }, (_, subIndex) => {
                  const minute = view === "day" ? subIndex * timeInterval : 0;
                  return (
                    <div
                      key={`${hour}-${subIndex}`}
                      className={`time-subcell ${subIndex > 0 ? "dashed-border" : ""}`}
                      data-hour={hour}
                      data-minute={minute}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const renderFacilityRows = () => {
    return flatFacilities.map((facility) => {
      const rowHeight = rowHeights[facility.id] || 48; // Default height if not measured yet

      return (
        <div
          key={facility.id}
          className="facility-row"
          data-facility-id={facility.id}
          style={{
            height: `${rowHeight}px`,
            minHeight: `${rowHeight}px`,
            maxHeight: `${rowHeight}px`,
          }}
        >
          {dates.map((date, dayIndex) => (
            <div key={dayIndex} className="day-cells">
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="hour-cells">
                  {Array.from({ length: subCellsPerHour }, (_, subIndex) => {
                    const minute = view === "day" ? subIndex * timeInterval : 0;
                    return (
                      <div
                        key={`${hour}-${subIndex}`}
                        className={`booking-cell ${subIndex > 0 ? "dashed-border" : ""}`}
                        onClick={() => onCellClick?.(facility.id, date, hour, minute)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <div className={`scheduler-grid view-${view}`}>
      <div className="time-headers">{renderTimeHeaders()}</div>
      <div className="facility-rows" ref={scrollRef}>
        {renderFacilityRows()}
      </div>
    </div>
  );
};
 */
