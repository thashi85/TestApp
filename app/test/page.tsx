"use client";

import { useState } from "react";

export default function TestHome() {
  return (
    <main>
      <SchedulerGridTest />
    </main>
  );
}

const facilities = [
  {
    id: 1,
    name: "Facility A asdas asdsa asdsad",
    schedules: [
      { time: "09:00", status: "Available" },
      { time: "10:00", status: "Booked" },
      { time: "11:00", status: "Available" },
    ],
  },
  {
    id: 2,
    name: "Facility B",
    schedules: [
      { time: "09:00", status: "Booked" },
      { time: "10:00", status: "Available" },
      { time: "11:00", status: "Booked" },
    ],
  },
];

const times = ["09:00", "10:00", "11:00"];

export function SchedulerGridTest() {
  const [minimized, setMinimized] = useState(false);

  return (
    <>
      <button onClick={() => setMinimized(!minimized)} style={{ marginBottom: 10 }}>
        {minimized ? "Expand Scheduler" : "Minimize Scheduler"}
      </button>

      <div
        className="scheduler-container"
        style={{ height: minimized ? 100 : "auto", overflow: minimized ? "hidden" : "visible" }}
      >
        {/* Date and Time rows */}
        <div className="row date-row">
          <div className="facility-cell">Date: 2024-06-01</div>
          <div className="scheduler-cells"></div>
        </div>

        <div className="row time-row">
          <div className="facility-cell">Time</div>
          <div className="scheduler-cells">
            {times.map((time) => (
              <div key={time} className="time-cell">
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* Facility rows */}
        {facilities.map((facility) => (
          <div className="row" key={facility.id}>
            <div className="facility-cell">{facility.name}</div>
            <div className="scheduler-cells">
              {facility.schedules.map((slot, idx) => (
                <div key={idx} className="time-cell">
                  {slot.status}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .scheduler-container {
          border: 1px solid #ccc;
          width: 100%;
          font-family: Arial, sans-serif;
        }
        .row {
          display: flex;
          border-bottom: 1px solid #ddd;
          align-items: stretch;
        }
        .row.date-row {
          background-color: #f0f0f0;
          font-weight: bold;
          border-bottom: 2px solid #aaa;
        }
        .facility-cell {
          flex: 0 0 150px;
          padding: 8px;
          background-color: #e6f0ff;
          border-right: 1px solid #ccc;
          font-weight: 600;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
          text-wrap: auto;
        }
        .scheduler-cells {
          display: flex;
          flex: 1;
          overflow-x: auto;
        }
        .time-cell {
          flex: 0 0 80px;
          padding: 8px;
          text-align: center;
          border-right: 1px solid #ccc;
          white-space: nowrap;
        }
        .time-row .facility-cell {
          background-color: #cce0ff;
        }
      `}</style>
    </>
  );
}
