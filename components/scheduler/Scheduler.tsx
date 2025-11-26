"use client";

import React from "react";
import { SchedulerHeader } from "./SchedulerHeader";
import { FacilityColumn } from "./FacilityColumn";
import { SchedulerGrid } from "./SchedulerGrid";
import { useScheduler, useResponsive, useRowHeights } from "@/lib/scheduler/hooks";
import { useScrollSync } from "./ScrollSync";
import { Facility } from "@/lib/scheduler/types";

interface SchedulerProps {
  initialFacilities: Facility[];
}

export const Scheduler: React.FC<SchedulerProps> = ({ initialFacilities }) => {
  const {
    view,
    setView,
    timeInterval,
    setTimeInterval,
    startDate,
    setStartDate,
    facilities,
    toggleFacility,
    bookings,
  } = useScheduler(initialFacilities);

  const { screenSize } = useResponsive();
  const { rowHeights, registerRow, updateRowHeights } = useRowHeights(facilities);
  const { facilityListRef, gridRowsRef } = useScrollSync();

  const handleCellClick = (facilityId: string, date: Date, hour: number, minute: number) => {
    console.log("Cell clicked:", { facilityId, date, hour, minute });
  };

  const handleToggleFacility = (facilityId: string) => {
    toggleFacility(facilityId);
    /*  setTimeout(() => {
      updateRowHeights();
    }, 50); */
  };

  return (
    <div className={`scheduler-container screen-${screenSize}`}>
      <SchedulerHeader
        view={view}
        onViewChange={setView}
        timeInterval={timeInterval}
        onIntervalChange={setTimeInterval}
        startDate={startDate}
        onDateChange={setStartDate}
      />

      <div className="scheduler-body">
        {/*  <FacilityColumn
          facilities={facilities}
          onToggle={handleToggleFacility}
          registerRow={registerRow}
          scrollRef={facilityListRef}
        /> */}

        <div className="scheduler-grid-wrapper">
          <SchedulerGrid
            view={view}
            timeInterval={timeInterval}
            startDate={startDate}
            facilities={facilities}
            bookings={bookings}
            onCellClick={handleCellClick}
            onToggle={handleToggleFacility}
            //rowHeights={rowHeights}
            scrollRef={gridRowsRef}
          />
        </div>
      </div>
    </div>
  );
};
