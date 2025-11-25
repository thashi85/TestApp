"use client";

import React, { useRef, useEffect } from "react";
import { Facility } from "@/lib/scheduler/types";

interface FacilityColumnProps {
  facilities: Facility[];
  onToggle: (facilityId: string) => void;
  registerRow: (facilityId: string, element: HTMLDivElement | null) => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

const FacilityItem: React.FC<{
  facility: Facility;
  level: number;
  onToggle: (id: string) => void;
  registerRow: (facilityId: string, element: HTMLDivElement | null) => void;
}> = ({ facility, level, onToggle, registerRow }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const hasChildren = facility.children && facility.children.length > 0;
  const paddingLeft = level * 20;

  useEffect(() => {
    // Register this row with the height tracker
    registerRow(facility.id, itemRef.current);

    return () => {
      registerRow(facility.id, null);
    };
  }, [facility.id, registerRow]);

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
      {facility.isExpanded && facility.children && (
        <>
          {facility.children.map((child) => (
            <FacilityItem
              key={child.id}
              facility={child}
              level={level + 1}
              onToggle={onToggle}
              registerRow={registerRow}
            />
          ))}
        </>
      )}
    </>
  );
};

export const FacilityColumn: React.FC<FacilityColumnProps> = ({ facilities, onToggle, registerRow, scrollRef }) => {
  return (
    <div className="facility-column">
      <div className="facility-header">Facilities</div>
      <div className="facility-list" ref={scrollRef}>
        {facilities.map((facility) => (
          <FacilityItem key={facility.id} facility={facility} level={0} onToggle={onToggle} registerRow={registerRow} />
        ))}
      </div>
    </div>
  );
};
